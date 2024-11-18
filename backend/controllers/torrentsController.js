import { addTorrent } from "../helpers/torrents.js";

function postTorrent(req, res) {
  if(!req.query.fileURL) {
    res.sendStatus(400);
  }
  addTorrent(req.query.fileURL);
  res.sendStatus(201);
}

export default {postTorrent}