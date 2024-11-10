/* 
This is the logic of the WebSocket server. It uses the DB Manager to handle interaction with the DB.
The server logic should send the clint request to the DB Manager, where the instruction will be evaluated further.
The websocket instance will be responsble for relaying the DB Manager events to the connected client.

An EventEmitter is used to advertise the change in server connections to each client, 
firing everytime a new connection is established or a connection is closed
*/

import { _status, _instruct, processInstruct, dbEvent } from "./dbManager.js";
import EventEmitter from "node:events";

const connEvent = new EventEmitter();
let connections = 0;

/**
 * @param {string} console
 * @returns {string}
 */
function jsonString(console) {
  return JSON.stringify({
    console,
    db_status: _status,
    db_instruct: _instruct,
    connections,
  });
}

/**
 * @param {WebSocket} ws
 */
export function onSocketConnect(ws) {
  connections += 1;
  connEvent.emit("update");

  const dbListener = (msg) => ws.send(jsonString(msg));
  const connListener = () => ws.send(jsonString(null));

  dbEvent.on("update", dbListener);
  connEvent.on("update", connListener);
  
  ws.on("error", console.error);
  ws.on("message", async function message(data) {
    const instruct = data.toString();
    if (!processInstruct(instruct)) {
      ws.send(jsonString(`! Instruction Not Recognized | ${instruct}`));
    }
  });
  ws.on("close", () => {
    connections -= 1;
    dbEvent.off("update", dbListener);
    connEvent.off("update", connListener);
    connEvent.emit("update");
  });

  ws.send(jsonString("Hello from Server!"));
}
