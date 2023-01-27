const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");

const { processVideoToFrames } = require("./utilities/videoToFrames");

dotenv.config({ path: "./config.env" });
const app = express();
const DB = process.env.DATABASE_URL.replace(
  "<username>",
  process.env.DATABASE_USERNAME
).replace("<password>", process.env.DATABASE_PASSWORD);

const port = process.env.PORT * 1 || 8080;
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  processVideoToFrames("./videos/input", "./videos/output");
  res.send("Testing!!!!!!");
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`App server is Running on port ${port}`);
});
