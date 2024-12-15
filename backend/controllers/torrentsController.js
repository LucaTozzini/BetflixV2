import { addTorrent } from "../helpers/torrents.js";
import { fetchMovieTorrents } from "../helpers/yifiLink.js";

async function post(req, res) {
  if (!req.query.fileURL) {
    res.sendStatus(400);
    return;
  }
  await addTorrent(req.query.fileURL);
  res.sendStatus(201);
}

async function get(req, res) {
  const torrents = await fetchMovieTorrents(req.query.imdbId);
  if (torrents) {
    res.json(torrents);
  } else {
    res.sendStatus(404);
  }
}

export default { post, get };
