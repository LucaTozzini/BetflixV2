/*
To use database, await dbPromise which will return a Database instance.
dbPromise.then(db => ...)

The API documentations for sqlite3 can be found here: https://github.com/TryGhost/node-sqlite3/wiki/API
*/

import dbPromise from "./connection.js";

/**
 * Insert local to external link
 * @param {number} mediaId
 * @param {number} tmdbId
 * @param {string} poster_path
 * @param {string} backdrop_path
 * @param {string} overview
 * @param {string} genres
 * @returns {Promise<object>}
 */
export function insertLink(
  mediaId,
  tmdbId,
  title,
  poster_path,
  backdrop_path,
  overview,
  genres
) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.run(
        "INSERT INTO link (media_id, tmdb_id, title, poster_path, backdrop_path, overview, genres) VALUES (?,?,?,?,?,?,?)",
        [mediaId, tmdbId, title, poster_path, backdrop_path, overview, genres],
        (err) => (err ? rej(err) : res())
      )
    )
  );
}

/**
 * INSERT a show into the media TABLE
 * @param {string} path absolute path of show folder
 * @param {string} title
 * @param {number} year
 * @returns {Promise}
 */
export function insertShow(path, title, year) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.run(
        `INSERT INTO media(path, title, year, type) VALUES (?,?,?,"show")`,
        [path, title, year],
        (err) => (err ? rej(err) : res())
      )
    )
  );
}

export function insertEpisode(mediaId, path, seasonNum, episodeNum, duration) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.run(
        "INSERT INTO episodes(media_id, path, season_num, episode_num, duration) VALUES (?,?,?,?,?)",
        [mediaId, path, seasonNum, episodeNum, duration],
        (err) => (err ? rej(err) : res())
      )
    )
  );
}
