/**
 * Allow HTTP server to interact with the TMDb API through these functions
 * Documentations for TMDBb API v3 are found here:
 * https://developer.themoviedb.org/reference/intro/getting-started
 */

import dotenv from "dotenv";
dotenv.config();

const API_ADDRESS = "https://api.themoviedb.org/3";

/**
 * Fetch the current popular movies on TMDb
 * @returns {Promise}
 */
export async function fetchPopularMovies() {
  try {
    const url = `${API_ADDRESS}/movie/popular?language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const { results } = await response.json();
    return results;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch the details for a single movie
 * @param {number} tmdbId 
 * @returns {Promise}
 */
export async function fetchMovieDetails(tmdbId) {
  try {
    const url = `${API_ADDRESS}/movie/${tmdbId}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (err) {
    throw err;
  }
}
