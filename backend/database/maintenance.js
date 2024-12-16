import dbPromise from "./connection.js";

async function createDB() {
  const db = await dbPromise;
  try {
    await new Promise((res, rej) => {
      db.exec(
        `CREATE TABLE IF NOT EXISTS media (
          media_id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT UNIQUE,
          title TEXT,
          year INT,
          duration INT,
          type TEXT
        );
        CREATE TABLE IF NOT EXISTS episodes (
          media_id INT,
          path TEXT PRIMARY KEY,
          season_num INT,
          episode_num INT,
          duration INT
        );
        CREATE TABLE IF NOT EXISTS link (
          media_id INT PRIMARY KEY,
          tmdb_id INT,
          title TEXT,
          poster_path TEXT,
          backdrop_path TEXT,
          overview TEXT,
          genres TEXT,
          date TEXT
        );
        `,
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
      db.exec("DROP TABLE media; DROP TABLE episodes; DROP TABLE link;", (err) =>
        err ? rej(err) : res()
      );
    });
  } catch (err) {
    throw err;
  }
}

export { createDB, purgeDB };
