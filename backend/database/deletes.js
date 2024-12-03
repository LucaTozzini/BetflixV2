/* 
To use database, await dbPromise which will return a Database instance.
dbPromise.then(db => ...)

The API documentations for sqlite3 can be found here: https://github.com/TryGhost/node-sqlite3/wiki/API

SQL DELETE DOCS: https://www.w3schools.com/sql/sql_delete.asp 
*/
import dbPromise from "./connection.js";

export function deleteLink(mediaId) {
  return new Promise((res, rej) =>
    dbPromise.then((db) =>
      db.run("DELETE FROM link WHERE media_id = ?", [mediaId], (err) =>
        err ? rej(err) : res()
      )
    )
  );
}
