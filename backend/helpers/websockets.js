/* 
This is the logic of the WebSocket server. It uses the DB Manager to handle interaction with the DB.
The server logic should send the clint request to the DB Manager, where the instruction will be evaluated further.
The websocket instance will be responsble for relaying the DB Manager events to the connected client.

An EventEmitter is used to advertise the change in server connections to each client, 
firing everytime a new connection is established or a connection is closed
*/

import {
  _status,
  _instruct,
  processInstruct,
  dbEvent,
} from "../database/manager.js";
import { progressEvent, getDownloads } from "./torrents.js";
import { v4 as uuidv4 } from "uuid";
import EventEmitter from "node:events";

const connEvent = new EventEmitter();
const consoleConnections = {};
const downloadsConnections = {};

function broadcastConsole(msg) {
  const ids = Object.keys(consoleConnections);
  for (const id of ids) {
    consoleConnections[id].send(
      JSON.stringify({
        console: msg,
        db_status: _status,
        db_instruct: _instruct,
        connections: ids.length,
      })
    );
  }
}

function broadcastDownloads(obj) {
  const ids = Object.keys(downloadsConnections);
  for (const id of ids) {
    downloadsConnections[id].send(JSON.stringify(obj));
  }
}

dbEvent.addListener("update", broadcastConsole);
connEvent.addListener("update", () => broadcastConsole(null));
progressEvent.addListener("update", broadcastDownloads);

function consoleConnect(ws) {
  const id = uuidv4();
  consoleConnections[id] = ws;
  connEvent.emit("update");

  ws.on("error", console.error);
  ws.on("message", async function message(data) {
    const instruct = data.toString();
    if (!processInstruct(instruct)) {
      ws.send(
        JSON.stringify({
          console: "Instruction Unrecognized -> " + instruct,
          db_status: _status,
          db_instruct: _instruct,
          connections: Object.keys(consoleConnections).length,
        })
      );
    }
  });
  ws.on("close", () => {
    delete consoleConnections[id];
    connEvent.emit("update");
  });

  ws.send(
    JSON.stringify({
      console: "Hello from server!",
      db_status: _status,
      db_instruct: _instruct,
      connections: Object.keys(consoleConnections).length,
    })
  );
}

function downloadsConnect(ws) {
  const id = uuidv4();
  downloadsConnections[id] = ws;
  ws.send(JSON.stringify(getDownloads()));
  ws.on("close", () => {
    delete downloadsConnections[id];
  });
}

/**
 * @param {WebSocket} ws
 * @param {any} req
 */
export function onSocketConnect(ws, req) {
  if (req.url === "/downloads") {
    downloadsConnect(ws);
  } else {
    consoleConnect(ws);
  }
}
