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
let timeout = null;
client.on("error", (err) => console.error("\nWebTorrent Error", err.message));

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

/*
Throttle updates to 1 per second
This is done by setting the timeout if one is not already active
Once the timeout expires it will send the status at the time of expiration
*/
function progressUpdate() {
  if (timeout) return;
  timeout = new setTimeout(() => {
    progressEvent.emit("update", getDownloads());
    timeout = null;
  }, 1000);
}

/**
 * Returns the buffer of .torrent file from a URL
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
 * Add torrent to downloads
 * @param {string} fileURL
 */
export function addTorrent(fileURL) {
  return new Promise(async (res, rej) => {
    try {
      const buffer = await bufferFromURL(fileURL);
      client.add(buffer, { path: process.env.MOVIES_PATH }, (torrent) => {
        res();
        torrent.on("download", progressUpdate);
        torrent.on("done", () =>
          torrent.destroy((err) => {
            if (err) {
              console.error(err.message);
            }
            progressUpdate();
          })
        );
      });
    } catch (err) {
      rej(err);
    }
  });
}
