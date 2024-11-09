import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();

const { Database } = sqlite3.verbose();

export default new Promise((res, rej) => {
  const db = new Database(process.env.DB_PATH, (err) => {
    if (err) {
      console.error("Error connecting to the database", err);
      rej(err);
    } else {
      console.log("Connected to SQLite database");
      res(db);
    }
  });
});