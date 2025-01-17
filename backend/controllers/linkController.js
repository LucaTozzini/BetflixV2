import { existsMediaId } from "../database/reads.js";
import { fetchMovieDetails, fetchShowDetails } from "../helpers/tmdbLink.js";
import { insertLink } from "../database/writes.js";
import { selectLink, selectLinkByTmdbId } from "../database/reads.js";
import { deleteLink } from "../database/deletes.js";
import idToGenre from "../helpers/idToGenre.js";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function post(req, res) {
  // mediaId and tmdbId are required to perform link
  if (
    isNaN(req.query.mediaId) ||
    isNaN(req.query.tmdbId) ||
    !["show", "movie"].includes(req.query.type)
  ) {
    res.sendStatus(400); // Bad request
    return;
  }

  // Check if given mediaId exists
  const existsId = await existsMediaId(req.query.mediaId);
  if (!existsId) {
    res.status(404).send("media id does not exist"); // Not found
    return;
  }

  // Fetch details
  const details =
    req.query.type === "movie"
      ? await fetchMovieDetails(req.query.tmdbId)
      : await fetchShowDetails(req.query.tmdbId);
  if (!details) {
    res.status(404).send("tmdb id doesn not exist"); // Not found
    return;
  }

  // link TABLE COLUMNS: media_id	tmdb_id	poster backdrop genres
  await insertLink(
    req.query.mediaId,
    details.id,
    req.query.type === "movie" ? details.title : details.name,
    details.poster_path,
    details.backdrop_path,
    details.genres?.map((i) => idToGenre[i.id]).join(", "),
    req.query.type === "movie" ? details.release_date : details.first_air_date
  );

  res.sendStatus(201);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function del(req, res) {
  if (isNaN(req.query.mediaId)) {
    res.sendStatus(400);
    return;
  }

  await deleteLink(req.query.mediaId);
  res.sendStatus(200);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function get(req, res) {
  if (isNaN(req.query.mediaId) && isNaN(req.query.tmdbId)) {
    res.sendStatus(400);
    return;
  }

  const data = req.query.mediaId
    ? await selectLink(req.query.mediaId)
    : await selectLinkByTmdbId(req.query.tmdbId);
  if (!data) {
    res.sendStatus(404);
    return;
  }

  res.json(data);
}

export default { post, get, del };
