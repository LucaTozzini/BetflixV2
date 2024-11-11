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
          title TEXT,
          season_num INT,
          episode_num INT,
          duration INT,
          UNIQUE(media_id, season_num, episode_num)
        )
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
      db.exec("DROP TABLE media; DROP TABLE episodes", (err) =>
        err ? rej(err) : res()
      );
    });
  } catch (err) {
    throw err;
  }
}

export { createDB, purgeDB };
