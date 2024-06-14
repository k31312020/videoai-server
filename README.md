#Video Server

A simple video manager built using express, jsonwebtoken, dotenv, prisma and multer for managing video files 
See package.json for details

## Demo
deployed at https://videoai.kuenzang.xyz

## setup 
```git clone https://github.com/k31312020/videoai-server.git```
```npm install```

## start server
Before starting
- create .env file like
- ```
  HOSTNAME=localhost
  PORT=5000
  DATABASE_URL=postgres://test:test@localhost:5432/video
  SECRET=yoursecret
  ```
- Need to set start a sql database
- create video database and
- push migrations to db
to start server
```npm rum start```


