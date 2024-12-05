import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { onSocketConnect } from "./helpers/websockets.js";
//
import mediaRouter from "./routes/media.js";
import externalRouter from "./routes/external.js";
import streamRouter from "./routes/stream.js";
import torrentsRouter from "./routes/torrents.js";
import linkRouter from "./routes/link.js";
import searchRouter from "./routes/search.js";
//
import dotenv from "dotenv";
dotenv.config();

/*
In order to have both the REST and WS servers listening on the same port, they are both connected to a createServer instance.
The WebSocket server can detect WebSocket handshake requests (those with the Upgrade: websocket header) and handle them, while regular HTTP requests are handled by Express.
*/
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// #region REST API

/* 
Enable cross origin sharing for all origins
Since this is a local server not exposed to the public this should not be a security issue
*/
app.use(cors());

// 
app.get("/", (req, res) => res.sendStatus(200))

// Use routers
app.use("/link", linkRouter);
app.use("/media", mediaRouter);
app.use("/stream", streamRouter);
app.use("/search", searchRouter);
app.use("/external", externalRouter);
app.use("/torrents", torrentsRouter);

/*
Global error handler
Define this after all other app.use https://expressjs.com/en/guide/error-handling.html
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// #endregion

wss.on("connection", onSocketConnect);

// Start HTTP server
server.listen(process.env.SERVER_PORT, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(
    "Server listening on port",
    process.env.SERVER_PORT,
    `\nConnect from this machine @ http://localhost:${process.env.SERVER_PORT}`
  );
});
