const dotenv = require('dotenv');
dotenv.config();

const express = require("express");

const app = express();

const {HOSTNAME, PORT} = process.env;

app.get('/v1/', (req, res) => {
  res.statusCode = 200;
  res.end("Hello World!\n");
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});