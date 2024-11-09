import fs from "fs";
import path from "path";
import dbPromise from "../database/connection.js";
import dotenv from "dotenv";
dotenv.config();

const VALID_EXT = [".mp4", ".mkv", ".m4a"];

/**
 * @param {string} root
 */
function scanMovies(root, db) {
  const content = fs.readdirSync(root);
  for (const item of content) {
    const stats = fs.statSync(path.join(root, item));
    const item_path = path.join(root, item);
    if (stats.isDirectory()) {
      scanMovies(item_path, db);
    } else if (VALID_EXT.includes(path.extname(item))) {
      const match = item.match(/^(?<title>.+)[^A-Za-z0-9]+(?<year>(19\d{2}|20\d{2}))[^A-Za-z0-9]+\b/);
      console.log(item, match);
    }
  }
}

dbPromise.then(db => {
  scanMovies(process.env.MOVIES_PATH, db);
});
