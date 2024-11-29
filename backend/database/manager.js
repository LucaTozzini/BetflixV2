/* 
This is the DB Manager. It is going to handle all DB operations and maintanance, 
ensuring that only one process is running at a given time.

The websocket server will be interacting with the DB through this manager, 
so error and edge-case prevention/avoidance needs to be addressed here.
*/

import fs from "fs";
import path from "path";
import EventEmitter from "node:events";
import dbPromise from "./connection.js";
import { getVideoDurationInSeconds as getDuration } from "get-video-duration";
import { createDB, purgeDB } from "./maintenance.js";
import { existsPath, selectMedia } from "./queries.js";
import dotenv from "dotenv";
dotenv.config();

// #region
/* 
variables to make sure a mispelling isn't going to cause errors.

INSTRUCT_FUNCT is to map the instruct name to its function

VALID_EXT are the valid media types to include in the DB 
*/
const STATUS = ["open", "busy"];
const INSTRUCT = ["scan", "clean", "create", "purge"];
const INSTRUCT_FUNCT = {
  scan: scan,
  clean: () => {},
  create: create,
  purge: purge,
};
const VALID_EXT = [".mp4", ".mkv", ".m4a"];
// #endregion

// #region
const dbEvent = new EventEmitter();
let _status = STATUS[0];
let _instruct = null;
// #endregion

// #region helpers
/**
 * @param {string} status
 * @param {string} instruct
 * @param {string} msg
 * Updates the _status and _instruct, then emits the event update with the given message.
 */
function dbUpdate(status, instruct, msg) {
  _status = status;
  _instruct = instruct;
  dbEvent.emit("update", msg);
}

/**
 * @param {string} root
 */
async function scanMovies(root) {
  try {
    const db = await dbPromise;
    const content = fs.readdirSync(root);
    for (const item of content) {
      try {
        const item_path = path.join(root, item);
        const stats = fs.statSync(item_path);
        if (stats.isDirectory()) {
          scanMovies(item_path, db);
          continue;
        }

        // Skip the file if it is of an invalid type
        const validType = VALID_EXT.includes(path.extname(item));
        // Skip the file if it's already in the database
        const inDB = await existsPath(item_path);
        if (validType && !inDB) {
          // Try to extract title and year from filename
          // Assume the string format is "title year otherstuff"
          const match = item.match(
            /^(?<title>.+)[^A-Za-z0-9]+(?<year>(19\d{2}|20\d{2}))[^A-Za-z0-9]/
          );

          const title = match?.groups?.title.replaceAll(".", " ").trim() ?? item;
          const year = match?.groups?.year ?? null;

          const duration = await getDuration(item_path);

          await new Promise((res, rej) =>
            db.run(
              "INSERT INTO media(path, title, year, duration, type) VALUES (?,?,?,?,?)",
              [
                item_path, // path
                title,
                year,
                Math.floor(duration), // duration (seconds)
                "movie", // type
              ],
              (err) => (err ? rej(err) : res())
            )
          );

          dbUpdate(_status, _instruct, `Found movie | ${title} (${year})`);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    throw err;
  }
}
// #endregion

// #region main
async function scan() {
  if (_status !== STATUS[0]) {
    dbUpdate(_status, _instruct, "Busy, scan rejected");
    return;
  }

  try {
    dbUpdate(STATUS[1], INSTRUCT[0], "Started scan");
    await scanMovies(process.env.MOVIES_PATH);
    dbUpdate(STATUS[0], null, "Finished scan");
  } catch (err) {
    dbUpdate(STATUS[0], null, `ERROR scan | ${err.message}`);
  }
}

async function create() {
  if (_status !== STATUS[0]) {
    dbUpdate(_status, _instruct, "Busy, create rejected");
    return;
  }

  try {
    dbUpdate(STATUS[1], INSTRUCT[2], "Started create");
    await createDB();
    dbUpdate(STATUS[0], null, "Finished create");
  } catch (err) {
    dbUpdate(STATUS[0], null, `Error create | ${err.message}`);
  }
}

async function purge() {
  if (_status !== STATUS[0]) {
    dbUpdate(_status, _instruct, "Busy, purge rejected");
    return;
  }

  try {
    dbUpdate(STATUS[1], INSTRUCT[3], "Started purge");
    await purgeDB();
    dbUpdate(STATUS[0], null, "Finished purge");
  } catch (err) {
    dbUpdate(STATUS[0], null, `Error purge | ${err.message}`);
  }
}
// #endregion

/**
 * @param {*} instruct
 * @returns {boolean}
 */
function processInstruct(instruct) {
  for (const i of INSTRUCT) {
    if (i === instruct) {
      INSTRUCT_FUNCT[i]();
      return true;
    }
  }
  return false;
}

export { _status, _instruct, dbEvent, processInstruct, link };
