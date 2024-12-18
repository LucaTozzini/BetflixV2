/* 
This is the DB Manager. It is going to handle all DB operations and maintanance, 
ensuring that only one process is running at a given time.

The websocket server will be interacting with the DB through this manager, 
so error and edge-case prevention/avoidance needs to be addressed here.
*/

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import EventEmitter from "node:events";
import dbPromise from "./connection.js";
import { fetchMovies, fetchShows } from "../helpers/tmdbLink.js";
import { createDB, purgeDB } from "./maintenance.js";
import { insertEpisode, insertShow, insertLink } from "./writes.js";
import { existsEpisodePath, existsMediaPath, selectLinkless } from "./reads.js";
import { getVideoDurationInSeconds as getDuration } from "get-video-duration";
import idToGenre from "../helpers/idToGenre.js";

dotenv.config();

// #region VARS
/* 
variables to make sure a mispelling isn't going to cause errors.

INSTRUCT_FUNCT is to map the instruct name to its function

VALID_EXT are the valid media types to include in the DB 
*/
const STATUS = ["open", "busy"];
const INSTRUCT = ["scan", "clean", "create", "purge", "autolink"];
const INSTRUCT_FUNCT = {
  scan: scan,
  clean: () => {},
  create: create,
  purge: purge,
  autolink: autolink,
};
const VALID_EXT = [".mp4", ".mkv", ".m4v"];
// #endregion

// #region EVENT
const dbEvent = new EventEmitter();
let _status = STATUS[0];
let _instruct = null;
// #endregion

// #region helpers
/**
 * Checks if file is valid video format
 * @param {string} filename
 * @returns {boolean}
 */
function isValid(filename) {
  const ext = path.extname(filename);
  return VALID_EXT.includes(ext);
}

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
 * Get the title and year from a movie's file name
 * @param {string} filename
 * @returns {title: string, year: number}
 */
function extractMovieData(filename) {
  // Try to extract title and year from filename
  // Assume the string format is "title year otherstuff"
  const match = filename.match(
    /^(?<title>.+)[^A-Za-z0-9]+(?<year>(19\d{2}|20\d{2}))[^A-Za-z0-9]/
  );

  // If no title extracted, use filename
  const title = match?.groups?.title?.replaceAll(".", " ").trim() ?? filename;
  const year = match?.groups?.year ?? null;

  return { title, year };
}

/**
 * Get the title and year from a show's folder name
 * @param {string} folder
 * @returns {{title: string, year: number}}
 */
function extractShowData(folder) {
  // Try to extract the show title and year from folder name
  const match = folder.match(
    /^(?<title>.+)[^A-Za-z0-9]+(?<year>(19\d{2}|20\d{2}))/
  );

  // If a match for the title is not found, use the folder name
  const title = match?.groups?.title?.replaceAll(".", " ").trim() ?? folder;
  const year = parseInt(match?.groups?.year) ?? null;

  return { title, year };
}

/**
 * Extracts season and episode number from filename
 * @param {string} filename
 * @returns {seasonNum: number, episodeNum: number}
 */
function extractEpisodeData(filename) {
  // Extract season and episode number
  // Not case sensitive -> /i
  const match = filename.match(
    /(S(?<seasonA>\d+)[\s\._]*E(?<episodeA>\d+))|(SEASON(?<seasonB>\d+)[\s\._]*EPISODE(?<episodeB>\d+))|([^A-Z0-9]*(?<seasonC>\d+)X(?<episodeC>\d+)[^A-Z0-9]*)/i
  );

  let seasonNum = undefined,
    episodeNum = undefined;

  // Check if a pair exists and set it
  if (match?.groups?.seasonA && match?.groups?.episodeA) {
    seasonNum = parseInt(match.groups.seasonA);
    episodeNum = parseInt(match.groups.episodeA);
  } else if (match?.groups?.seasonB && match?.groups?.episodeB) {
    seasonNum = parseInt(match.groups.seasonB);
    episodeNum = parseInt(match.groups.episodeB);
  } else if (match?.groups?.seasonC && match?.groups?.episodeC) {
    seasonNum = parseInt(match.groups.seasonC);
    episodeNum = parseInt(match.groups.episodeC);
  }

  return { seasonNum, episodeNum };
}

/**
 * Inserts show if it doesn't exist, then returns its mediaId
 * @param {string} path
 * @param {string} title
 * @param {number} year
 * @returns {Promise<{mediaId: number, showTitle: string}>}
 */
async function processShow(path, title, year) {
  // Insert show into DB if it doesn't exist
  if (!(await existsMediaPath(path))) {
    await insertShow(path, title, year);
    dbUpdate(_status, _instruct, `Found shows | ${title} (${year})`);
  }

  // Grab mediaId of path for later use
  const row = await new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get(
        "SELECT media_id AS mediaId, title AS showTitle FROM media WHERE path = ?",
        [path],
        (err, row) => (err ? rej(err) : res(row))
      )
    )
  );

  return row;
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
        const inDB = await existsMediaPath(item_path);
        if (validType && !inDB) {
          const { title, year } = extractMovieData(item);
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

async function scanShows(root) {
  // Get potential show folders
  const folders = fs
    .readdirSync(root)
    .filter((i) => fs.statSync(path.join(root, i)).isDirectory());

  for (const folder of folders) {
    try {
      const { title, year } = extractShowData(folder);
      const { mediaId, showTitle } = await processShow(
        path.join(root, folder),
        title,
        year
      );
      if (!mediaId) throw new Error("No mediaId");

      async function scanEpisodes(subfolder) {
        for (const item of fs.readdirSync(subfolder)) {
          try {
            // If item is a folder, recursively check for video files
            if (fs.statSync(path.join(subfolder, item)).isDirectory()) {
              await scanEpisodes(path.join(subfolder, item));
            }

            // Check if file has a valid extension
            else if (isValid(item)) {
              // Skip if path already in DB
              if (await existsEpisodePath(path.join(subfolder, item))) {
                continue;
              }

              const { seasonNum, episodeNum } = extractEpisodeData(item);

              // Skip if no match
              if (!seasonNum || !episodeNum) {
                continue;
              }

              const duration = await getDuration(path.join(subfolder, item));

              await insertEpisode(
                mediaId,
                path.join(subfolder, item),
                seasonNum,
                episodeNum,
                duration
              );

              dbUpdate(
                _status,
                _instruct,
                `Found episode | ${showTitle} S${seasonNum} E${episodeNum}`
              );
            }
          } catch (err) {
            console.error(err.message);
          }
        }
      }

      await scanEpisodes(path.join(root, folder));
    } catch (err) {
      console.error(err);
    }
  }

  // Set the average duration of a shows episodes as the show's duration
  await new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.run(
        `UPDATE media 
        SET duration = (
          SELECT AVG(duration) 
          FROM episodes 
          WHERE episodes.media_id = media.media_id
        ) 
        WHERE type = "show"`,
        (err) => (err ? rej(err) : res())
      )
    )
  );
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
    await scanShows(process.env.SHOWS_PATH);
    dbUpdate(STATUS[0], null, "Finished scan");
  } catch (err) {
    dbUpdate(STATUS[0], null, `ERROR scan | ${err.message}`);
    console.error(err.stack);
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
    console.error(err.stack);
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
    console.error(err.stack);
  }
}

async function autolink() {
  if (_status !== STATUS[0]) {
    dbUpdate(_status, _instruct, "Busy, autolink rejected");
    return;
  }
  try {
    dbUpdate(STATUS[1], INSTRUCT[4], "Started autolink");
    let offset = 0;
    const limit = 20;

    // Process 20 media items at a time
    while (true) {
      const group = await selectLinkless(offset, limit);
      console.log(offset, limit, group.length)
      if (!group.length) break;
      for (const media of group) {
        const data =
          media.type === "movie"
            ? await fetchMovies(media.title, media.year)
            : await fetchShows(media.title, media.year);

        // If there is no match for item
        // Increment the offset so that on next loop, the item will be skipped
        if (!data || !data.length) {
          offset++;
          continue;
        }

        await insertLink(
          media.media_id,
          data[0].id,
          data[0].title ?? data[0].name,
          data[0].poster_path,
          data[0].backdrop_path,
          data[0].overview,
          data[0].genre_ids?.map((i) => idToGenre[i]).join(", "),
          data[0].release_date ?? data[0].first_air_date
        );

        dbUpdate(
          _status,
          _instruct,
          `Autolinked | ${data[0].title ?? data[0].name} ${
            data[0].release_date ?? data[0].first_air_date
          }`
        );
      }
    }
    dbUpdate(STATUS[0], null, `Finished autolink`);
  } catch (err) {
    dbUpdate(STATUS[0], null, `Error autolink | ${err.message}`);
    console.error(err.stack);
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

export { _status, _instruct, dbEvent, processInstruct };
