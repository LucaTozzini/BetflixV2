import {
  fetchPopularMovies,
  fetchMovies,
  fetchMovieDetails,
  fetchShows,
  fetchShowDetails,
} from "../helpers/tmdbLink.js";

async function popularMovies(req, res) {
  const popular = await fetchPopularMovies();
  res.json(popular);
}

async function movies(req, res) {
  if (!req.query.query) {
    res.sendStatus(400);
    return;
  }
  const data = await fetchMovies(req.query.query, req.query.year);
  res.json(data);
}

async function shows(req, res) {
  if (!req.query.query) {
    res.sendStatus(400);
    return;
  }
  const data = await fetchShows(req.query.query, req.query.year);
  res.json(data);
}

async function movieDetails(req, res) {
  if (isNaN(req.params.tmdbId)) {
    res.sendStatus(400);
    return;
  }
  const data = await fetchMovieDetails(req.params.tmdbId);
  res.json(data);
}

async function showDetails(req, res) {
  if (isNaN(req.params.tmdbId)) {
    res.sendStatus(400);
    return;
  }
  const data = await fetchShowDetails(req.params.tmdbId);
  res.json(data);
}

export default {
  popularMovies,
  movies,
  shows,
  movieDetails,
  showDetails
};
