import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { error } from "console";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + (req.body.filename || file.originalname) + "." + file.mimetype.split('/')[1]);
    },
})

const filter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith('video')) {
        cb(null, true)
    } else {
        cb('Not an image! Please upload only videos.', 400)
    }
}

const upload = multer({
    storage,
    fileFilter: filter,
    limits: {
        fileSize: 100000000
    }
})

const prisma = new PrismaClient()

dotenv.config();

const express = require("express");

const app = express();
app.use(express.json())

const { HOSTNAME, PORT, SECRET } = process.env;

const authorize = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")
    try {
        if (token && SECRET) {
            const decoded = jwt.verify(token, SECRET);
            (req as any).user = decoded
            next()
        } else {
            throw Error()
        }
    } catch (err) {
        res.status(403).send({ response: { message: "Forbidden!" } })
    }
}

app.post('/v1/login', async (req: Request, res: Response) => {
    let user = await prisma.user.findFirst({
        where: {
            name: req.body.name
        }
    })
    const valid = user?.name.toLowerCase() === req.body?.name.toLowerCase() && user?.password === req.body?.password
    if (user && SECRET && valid) {
        const token = jwt.sign({ id: user.id, name: user.name }, SECRET, {
            expiresIn: "2h"
        })
        res.status(200).send({ response: { token } });
    } else {
        res.status(404).send({ response: { error: "Invalid username or password" } })
    }
});

app.post('/v1/upload', authorize, (req: Request, res: Response) => {
    upload.single("file")(req, res, async (err) => {
        if (err) {
            res.status(404).send({ response: { message: "Could not upload file!" } });
        } else if (req.file) {
            const response = await prisma.video.create({
                data: {
                    filename: req.file.filename
                }
            })
            res.status(204).send({ response: { ...response, message: "File uploaded successfully" } });
        } else {
            res.status(404).send({ response: { message: "Could not upload file!" } });
        }
    })
});

app.get('/v1/videos', authorize, async (req: Request, res: Response) => {
    const videos = await prisma.video.findMany()
    res.status(200).send({ response: { videos } })
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});