import dbPromise from "./connection.js";

async function createDB() {
  const db = await dbPromise;
  try {
    await new Promise((res, rej) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS movies (
        path TEXT PRIMARY KEY,
        title TEXT,
        year INT
      )`,
        (err) => (err ? rej(err) : res())
      );
    });
  } catch (err) {
    throw err;
  }
}

async function purgeDB() {
  const db = await dbPromise;
  try {
    await new Promise((res, rej) => {
      db.run("DROP TABLE movies", (err) => (err ? rej(err) : res()));
    });
  } catch (err) {
    throw err;
  }
}

export {createDB, purgeDB}
