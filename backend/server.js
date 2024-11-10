import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { onSocketConnect } from "./helpers/websockets.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send(`<h1>Server is Running!</h1>`);
});

wss.on("connection", onSocketConnect);

server.listen(process.env.SERVER_PORT, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log("Server listening on port", process.env.SERVER_PORT);
  console.log(
    `Connect from this machine @ http://localhost:${process.env.SERVER_PORT}`
  );
});
