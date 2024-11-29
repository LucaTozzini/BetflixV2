import { existsMediaId } from "../database/queries.js";
import { fetchMovieDetails } from "../helpers/tmdbLink.js";
async function linkMovie(req, res) {
  // mediaId and tmdbId are required to perform link
  if (isNaN(req.query.mediaId) || isNaN(req.query.tmdbId)) {
    res.sendStatus(400); // Bad request
    return;
  }

  // Check if given mediaId exists
  const existsId = await existsMediaId(req.query.mediaId);
  if (!existsId) {
    res.sendStatus(404); // Not found
    return;
  }

  // Fetch movie details
  const details = await fetchMovieDetails(req.query.tmdbId);
  if (!details) {
    res.sendStatus(404); // Not found
  }

  
}

export { linkMedia };
