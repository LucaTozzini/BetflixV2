import { addTorrent } from "../helpers/torrents.js";

async function postTorrent(req, res) {
  if(!req.query.fileURL) {
    res.sendStatus(400);
  }
  await addTorrent(req.query.fileURL);
  res.sendStatus(201);
}

export default {postTorrent}