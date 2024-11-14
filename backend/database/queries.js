/**
 * To use database, await dbPromise which will return a Database instance.
 * dbPromise.then(db => ...)
 *
 * The API documentations for sqlite3 can be found here: https://github.com/TryGhost/node-sqlite3/wiki/API
 */

import dbPromise from "./connection.js";

/**
 * Retrieves a media collection based on the parameters given
 * @param {number} offset
 * @param {number} limit
 * @param {string} order
 * @param {boolean} desc
 * @param {string} type
 * @return {Promise<Array<object>>}
 */
export function selectMediaCollection(offset, limit, order, desc, type) {
  // If no type is specified, assume all types are requested
  const typeA = type ? type : "movie";
  const typeB = type ? type : "show";

  return new Promise((res, rej) => {
    dbPromise.then((db) => {
      const validColumns = ["year", "title", "duration"];
      db.all(
        `SELECT * 
        FROM media
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
 * @returns {Promise<object>}
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
 * Checks if the path is already in the database
 * @param {string} path 
 * @returns {Promise<boolean>}
 */
export function existsPath(path) {
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
