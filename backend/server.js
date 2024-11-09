import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
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

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    const json = await JSON.parse(data.toString());  
    if(json.console) {
      ws.send(JSON.stringify({console: `> ${json.console}`}))
    }
  });

  ws.send(JSON.stringify({console: "Hello from server!"}));
});

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
