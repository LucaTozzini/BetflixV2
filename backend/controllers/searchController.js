import { searchMedia } from "../database/reads.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function get(req, res) {
  if (!req.query.title) {
    res.sendStatus(400);
    return;
  }

  const data = await searchMedia(req.query.title);
  res.json(data);
}

export default {get};
