/**
 * To use database, await dbPromise which will return a Database instance.
 * dbPromise.then(db => ...)
 *
 * The API documentations for sqlite3 can be found here: https://github.com/TryGhost/node-sqlite3/wiki/API
 */

// #region JSDocs

/**
 * @typedef {Obj} mediaRow
 * @property {number} media_id
 * @property {string} path
 * @property {string} title
 * @property {number} year
 * @property {number} duration
 * @property {string} type movie or show
 *
 */

/**
 * @typedef {Obj} linkRow
 * @property {number} media_id
 * @property {number} tmdb_id
 * @property {string} poster
 * @property {string} backdrop
 * @property {string} overview
 * @property {string} genres
 */

/**
 * @typedef {Obj} episodeRow
 * @property {number} media_id
 * @property {string} path
 * @property {number} season_num
 * @property {number} episode_num
 * @property {number} duration
 */
// #endregion

import dbPromise from "./connection.js";

/**
 * Retrieves a media collection based on the parameters given
 * @param {number} offset
 * @param {number} limit
 * @param {string} order year, title, duration
 * @param {boolean} desc
 * @param {string} type
 * @return {Promise<Array<mediaRow>>}
 */
export function selectMediaCollection(offset, limit, order, desc, type) {
  // If no type is specified, assume all types are requested
  const typeA = type ? type : "movie";
  const typeB = type ? type : "show";

  return new Promise((res, rej) => {
    dbPromise.then((db) => {
      const validColumns = ["year", "title", "duration"];
      db.all(
        `SELECT media.*, link.title AS link_title, genres
        FROM media
        LEFT JOIN link ON media.media_id = link.media_id 
        WHERE type = ? OR type = ? 
        ORDER BY 
          ${validColumns.includes(order) ? order : "year"} 
          ${desc ? "DESC" : "ASC"}
        LIMIT ?
        OFFSET ?`,
        [typeA, typeB, limit ?? 20, offset ?? 0],
        (err, rows) => (err ? rej(err) : res(rows))
      );
    });
  });
}

/**
 * Retrieves a single media row with the given media_id
 * @param {number} mediaId
 * @returns {Promise<mediaRow>}
 */
export function selectMedia(mediaId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get("SELECT * FROM media WHERE media_id = ?", [mediaId], (err, row) =>
        err ? rej(err) : res(row)
      )
    )
  );
}

/**
 * @param {number} mediaId
 * @returns {Promise<Array<{season_num: number, episode_count: number}>>}
 */
export function selectSeasons(mediaId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.all(
        `SELECT season_num, COUNT(*) AS episode_count 
        FROM episodes 
        WHERE media_id = ?
        GROUP BY season_num
        ORDER BY season_num ASC`,
        [mediaId],
        (err, rows) => (err ? rej(err) : res(rows))
      )
    )
  );
}

/**
 * @param {number} mediaId
 * @param {number} seasonNum
 * @returns {Promise<Array<episodeRow>>}
 */
export function selectSeason(mediaId, seasonNum) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.all(
        "SELECT * FROM episodes WHERE media_id = ? AND season_num = ?",
        [mediaId, seasonNum],
        (err, rows) => (err ? rej(err) : res(rows))
      )
    )
  );
}

/**
 * @param {number} mediaId
 * @param {number} seasonNum
 * @param {number} episodeNum
 * @returns {Promise<episodeRow>}
 */
export function selectEpisode(mediaId, seasonNum, episodeNum) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get(
        `SELECT * 
        FROM episodes 
        WHERE 
          media_id = ? 
          AND season_num = ? 
          AND episode_num = ?`,
        [mediaId, seasonNum, episodeNum],
        (err, row) => (err ? rej(err) : res(row))
      )
    )
  );
}

/**
 * @param {number} mediaId
 * @returns {Promise<linkRow>}
 */
export function selectLink(mediaId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get("SELECT * FROM link WHERE media_id = ?", [mediaId], (err, row) =>
        err ? rej(err) : res(row)
      )
    )
  );
}

/**
 * @param {number} tmdbId
 * @returns {Promise<linkRow>}
 */
export function selectLinkByTmdbId(tmdbId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get("SELECT * FROM link WHERE tmdb_id = ?", [tmdbId], (err, row) =>
        err ? rej(err) : res(row)
      )
    )
  );
}

/**
 * Checks if the path is already in the database
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export function existsMediaPath(path) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get(
        "SELECT EXISTS(SELECT path FROM media WHERE path = ?) AS ex",
        [path],
        (err, row) => (err ? rej(err) : res(row.ex))
      )
    )
  );
}

/**
 *
 * @param {number} mediaId
 * @returns {Promise<boolean>}
 */
export function existsMediaId(mediaId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get(
        "SELECT EXISTS(SELECT * FROM media WHERE media_id = ?) AS ex",
        [mediaId],
        (err, row) => (err ? rej(err) : res(row.ex))
      )
    )
  );
}

/**
 * @param {string} path 
 * @returns {Promise<boolean>}
 */
export function existsEpisodePath(path) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.get(
        "SELECT EXISTS(SELECT * FROM episodes WHERE path = ?) AS ex",
        [path],
        (err, row) => (err ? rej(err) : res(row.ex))
      )
    )
  );
}

export function searchMedia(title) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.all(
        // length function: https://www.sqlitetutorial.net/sqlite-functions/sqlite-length/
        // If media doesn't have link, look at parsed filename (media.title)
        // If it is linked, look at linked title (link.title)
        // For universal ordering, set "difference" using corresponding title
        `SELECT * 
        FROM (
          SELECT media.*, NULL AS link_title, link.genres, LENGTH(media.title) - LENGTH(?) AS difference   
          FROM media 
          LEFT JOIN link ON link.media_id = media.media_id
          WHERE media.title LIKE ? AND link.title IS NULL
          
          UNION
          
          SELECT media.*, link.title AS link_title, link.genres, LENGTH(link.title) - LENGTH(?) AS difference
          FROM media
          JOIN link ON link.media_id = media.media_id
          WHERE link.title LIKE ?
        )
        ORDER BY difference
        `,
        [title, `%${title}%`, title, `%${title}%`],
        (err, rows) => (err ? rej(err) : res(rows))
      )
    )
  );
}
