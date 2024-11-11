import dbPromise from "./connection.js";

/**
 * @param {any} limit
 * @return {Promise<[]>}
 */
export function selectMedia(offset, limit, order, desc, type) {
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
