/**
 * Allow HTTP server to interact with the TMDb API through these functions
 * Documentations for TMDBb API v3 are found here:
 * https://developer.themoviedb.org/reference/intro/getting-started
 */

// #region JSDocs
/**
 * https://developer.themoviedb.org/reference/movie-popular-list
 * @typedef {Object} listMovieItem
 * @property {boolean} adult
 * @property {string} backdrop_path
 * @property {Array<number>} genre_ids
 * @property {number} id
 * @property {string} original_language
 * @property {string} original_title
 * @property {string} overview
 * @property {number} popularity
 * @property {string} poster_path
 * @property {string} release_date
 * @property {string} title
 * @property {boolean} video
 * @property {number} vote_average
 * @property {number} vote_count
 *
 */

/**
 * @typedef {Object} listShowItem
 * @property {boolean} adult
 * @property {string} backdrop_path
 * @property {Array<number>} genre_ids
 * @property {number} id
 * @property {string} original_country
 * @property {string} original_language
 * @property {string} original_name
 * @property {string} overview
 * @property {number} popularity
 * @property {string} poster_path
 * @property {string} first_air_date
 * @property {string} name
 * @property {number} vote_average
 * @property {number} vote_count
 */

/**
 * https://developer.themoviedb.org/reference/movie-details
 * @typedef {Object} movieDetails
 * @property {boolean} adult
 * @property {string} backdrop_path
 * @property {number} belongs_to_collection
 * @property {number} budget
 * @property {Array<{id: number, name: string}>} genres
 * @property {string} homepage
 * @property {number} id
 * @property {string} imdb_id
 * @property {string} original_language
 * @property {string} original_title
 * @property {string} overview
 * @property {number} popularity
 * @property {string} poster_path
 * @property {Array<{id: number, logo_path: string, name: string, origin_country: string}>} production_companies
 * @property {Array<{iso_3166_1: string, name: string}>} production_countries
 * @property {string} release_date
 * @property {number} revenue
 * @property {number} runtime
 * @property {Array<{english_name: string, iso_639_1: string, name: string}>} spoken_languages
 * @property {string} status
 * @property {string} tagline
 * @property {string} title
 * @property {boolean} video
 * @property {number} vote_average
 * @property {number} vote_count
 */

/**
 * @typedef {Object} showDetails
 * @property {boolean} adult
 * @property {string} backdrop_path
 * @property {Array<{id: number, credit_id: number, gender: number, profile_path: string}>} created_by
 * @property {Array<number>} episode_run_time
 * @property {string} first_air_date
 * @property {Array<{id: number, name: string}>} genres
 * @property {string} homepage
 * @property {number} id
 * @property {boolean} in_production
 * @property {Array<string>} languages
 * @property {string} last_air_date
 * @property {episodeDetails} last_episode_to_air
 * @property {string} name
 * @property {string} next_episode_to_air
 * @property {Array<id: number, logo_path: string, name: string, origin_country: string>} networks
 * @property {number} number_of_episodes
 * @property {number} number_of_seasons
 * @property {string} origin_country
 * @property {string} original_language
 * @property {string} original_name
 * @property {string} overview
 * @property {number} popularity
 * @property {string} poster_path
 * @property {Array<{id: number, logo_path: string, name: string, origin_country: string}>} production_companies
 * @property {Array<{iso_3166_1: string, name: string}>} production_countries
 * @property {Array<{air_date: string, episode_count: number, id: number, overview: string, poster_path: string, season_number: number, vote_average: number}>} seasons
 * @property {Array<english_name: string, iso_639_1: string, name: string>} spoken_languages
 * @property {string} status
 * @property {string} tagline
 * @property {string} type
 * @property {number} vote_average
 * @property {number} vote_count
 *
 */

/**
 * @typedef {Object} episodeDetails
 */
// #endregion

import dotenv from "dotenv";
dotenv.config();

const API_ADDRESS = "https://api.themoviedb.org/3";
const GET_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
  },
};

/**
 * Fetch the current popular movies on TMDb
 * @returns {Promise<Array<listMovieItem>>}
 */
export async function fetchPopularMovies() {
  try {
    const url = `${API_ADDRESS}/movie/popular?language=en-US&page=1`;
    const response = await fetch(url, GET_OPTIONS);
    const { results } = await response.json();
    return results;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch the details for a single movie
 * @param {number} tmdbId
 * @returns {Promise<movieDetails>}
 */
export async function fetchMovieDetails(tmdbId) {
  try {
    const url = `${API_ADDRESS}/movie/${tmdbId}?append_to_response=credits`;
    const response = await fetch(url, GET_OPTIONS);
    const json = await response.json();
    return json;
  } catch (err) {
    throw err;
  }
}

/**
 * @param {number} tmdbId
 * @returns {Promise<showDetails>}
 */
export async function fetchShowDetails(tmdbId) {
  try {
    const url = `${API_ADDRESS}/tv/${tmdbId}?append_to_response=aggregate_credits`;
    const response = await fetch(url, GET_OPTIONS);
    const json = await response.json();
    return json;
  } catch (err) {
    throw err;
  }
}

/**
 * Serach for movies in TMDb
 * Note: query is required
 * @param {string} query
 * @param {number} year
 * @returns {Promise<Array<listMovieItem>>}
 */
export async function fetchMovies(query, year) {
  try {
    let url = `${API_ADDRESS}/search/movie?include_adult=false&query=${query}`;
    if (year) url += `&year=${year}`;
    const response = await fetch(url, GET_OPTIONS);
    const json = await response.json();
    return json.results;
  } catch (err) {
    throw err;
  }
}

/**
 * @param {string} query
 * @param {number} year optional
 * @returns {Promise<Array<listShowItem>>}
 */
export async function fetchShows(query, year) {
  try {
    let url = `${API_ADDRESS}/search/tv?query=${query}`;
    if (year) url += `&year=${year}`;
    const response = await fetch(url, GET_OPTIONS);
    const json = await response.json();
    return json.results;
  } catch (err) {
    throw err;
  }
}
