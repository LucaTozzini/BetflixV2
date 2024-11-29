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

    /* Example:
      {
        "adult": false,
        "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
        "belongs_to_collection": null,
        "budget": 63000000,
        "genres": [{ "id": 18, "name": "Drama"}, ...],
        "homepage": "http://www.foxmovies.com/movies/fight-club",
        "id": 550,
        "imdb_id": "tt0137523",
        "original_language": "en",
        "original_title": "Fight Club",
        "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
        "popularity": 61.416,
        "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        "production_companies": [ {"id": 508, "logo_path": "/7cxRWzi4LsVm4Utfpr1hfARNurT.png", "name": "Regency Enterprises", "origin_country": "US"}, ... ],
        "production_countries": [ {"iso_3166_1": "US", "name": "United States of America"}, ... ],
        "release_date": "1999-10-15",
        "revenue": 100853753,
        "runtime": 139,
        "spoken_languages": [ {"english_name": "English", "iso_639_1": "en", "name": "English" }, ... ],
        "status": "Released",
        "tagline": "Mischief. Mayhem. Soap.",
        "title": "Fight Club",
        "video": false,
        "vote_average": 8.433,
        "vote_count": 26280
      }
    */
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
 * @param {int} year
 */
export async function fetchMovies(query, year) {
  try {
    const url = `${API_ADDRESS}/search/movie?query=${query}${
      year ? `&year=${year}` : ""
    }`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      },
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return json.results;
  } catch (err) {
    throw err;
  }
}
