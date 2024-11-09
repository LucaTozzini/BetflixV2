import dbPromise from "./connection.js";

dbPromise.then(db => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movies (
      path TEXT PRIMARY KEY,
      title TEXT,
      year INT
    )`);
  });
});
