import { useState } from "react";
const SERVER = "localhost:5340";

export default function useQueries() {
  const [data, setData] = useState(null);

  function parString(key, value) {
    return !value || !key ? null : `${key}=${value}`;
  }

  async function genericGET(url) {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      setData(json);
    } else {
      setData(null);
    }
  }

  /**
   * @param {number} offset
   * @param {number} limit
   * @param {string} order
   * @param {string} type
   */
  function selectMediaCollection(offset, limit, order, desc, type) {
    const queryParams = `${[
      parString("offset", offset),
      parString("limit", limit),
      parString("order", order),
      parString("desc", desc),
      parString("type", type),
    ]
      .filter((i) => i)
      .join("&")}`;

    genericGET(`http://${SERVER}/media?${queryParams}`);
  }

  /**
   * @param {number} mediaId
   */
  function selectMedia(mediaId) {
    genericGET(`http://${SERVER}/media/${mediaId}`);
  }

  /**
   * Fetch current popular movies from TMDb
   */
  function fetchPopularMovies() {
    genericGET(`http://${SERVER}/external/popular-movies`);
  }

  /**
   * @param {string} query 
   * @param {int} year 
   */
  function fetchMovies(query, year) {
    const queryParams = `${[parString("query", query), parString("year", year)]
      .filter((i) => i)
      .join("&")}`;
    genericGET(`http://${SERVER}/external/movies?${queryParams}`);
  }

  /**
   * Fetch movie details from TMDb
   * @param {number} tmdbId
   */
  function fetchMovieDetails(tmdbId) {
    genericGET(`http://${SERVER}/external/movies/${tmdbId}`);
  }

  /**
   * Fetch available torrents for movie from Yifi
   * @param {string} imdbId
   */
  function fetchMovieTorrents(imdbId) {
    genericGET(`http://${SERVER}/external/torrents/${imdbId}`);
  }

  return {
    data,
    selectMedia,
    selectMediaCollection,
    fetchPopularMovies,
    fetchMovies,
    fetchMovieDetails,
    fetchMovieTorrents,
  };
}
