/** 
 * I don't know what the best way to share a Database instance is. I'm exporting a promise which resolves the instance.
 * This should make it so that other files can await/then in order to use db only once it is initialized.
 * 
 * The API documentations for sqlite3 can be found here: https://github.com/TryGhost/node-sqlite3/wiki/API 
 */

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