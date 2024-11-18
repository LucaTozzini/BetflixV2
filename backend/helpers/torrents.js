/* 
This torrents manager is going to handle all torrent related operations and events
The websocket server will be interacting with active torrents through this manager,
*/

// #region imports
import WebTorrent from "webtorrent";
import EventEmitter from "node:events";
import dotenv from "dotenv";
// #endregion

dotenv.config();
const client = new WebTorrent();

export function getDownloads() {
  return client.torrents.map((torrent) => ({
    name: torrent.name,
    progress: torrent.progress,
    downloadSpeed: torrent.downloadSpeed,
    timeRemaining: torrent.timeRemaining,
  }));
}

/*
From what I found on WebTorrent's docs @ https://github.com/webtorrent/webtorrent/blob/HEAD/docs/api.md
There is no event emitter for overall alient progress
The progressEvent aims to create that functionality
  - Fires on torrent download
  - Returns all torrents and their info    
*/
export const progressEvent = new EventEmitter();

function progressUpdate() {
  progressEvent.emit("update", getDownloads());
}

/**
 *
 * @param {string} fileURL
 * @returns {Promise<Buffer>}
 */
async function bufferFromURL(fileURL) {
  const response = await fetch(fileURL);
  if (!response.ok) {
    throw new Error("Response not OK");
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 *
 * @param {string} fileURL
 */
export async function addTorrent(fileURL) {
  const buffer = await bufferFromURL(fileURL);
  client.add(buffer, { path: process.env.TORRENTS_PATH }, (torrent) => {
    torrent.on("download", progressUpdate);
  });
}

addTorrent(
  "https://yts.mx/torrent/download/0C4D131A037FB44A1C0ACFC98302F6D32905D66A"
);
