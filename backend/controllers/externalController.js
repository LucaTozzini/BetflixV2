import {
  fetchPopularMovies,
  fetchMovies,
  fetchMovieDetails,
} from "../helpers/tmdbLink.js";
import { fetchMovieTorrents } from "../helpers/yifiLink.js";

async function popularMovies(req, res) {
  const popular = await fetchPopularMovies();
  res.json(popular);
}

async function movies(req, res) {
  if (!req.query.query) {
    res.sendStatus(400);
    return;
  }
  const movies = await fetchMovies(req.query.query, req.query.year);
  res.json(movies);
}

async function movieDetails(req, res) {
  const details = await fetchMovieDetails(req.params.tmdbId);
  res.json(details);
}

async function torrents(req, res) {
  const torrents = await fetchMovieTorrents(req.params.imdbId);
  if (torrents) {
    res.json(torrents);
  } else {
    res.sendStatus(404);
  }
}

export default {
  popularMovies,
  movies,
  movieDetails,
  torrents,
};
