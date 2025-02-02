import { useState } from "react";

// for dev
// const SERVER = "http://localhost:5340";

// for build
const SERVER = "";

export default function useQueries() {
  const [data, setData] = useState(null);

  function parString(key, value) {
    return !value || !key ? null : `${key}=${value}`;
  }

  /**
   * @param {string} endpoint
   */
  async function genericGET(endpoint) {
    const response = await fetch(`${SERVER}${endpoint}`);
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

    genericGET(`/media?${queryParams}`);
  }

  /**
   * @param {number} mediaId
   */
  function selectMedia(mediaId) {
    genericGET(`/media/${mediaId}`);
  }

  /**
   * @param {number} mediaId
   */
  function selectSeasons(mediaId) {
    genericGET(`/media/${mediaId}/seasons`);
  }

  function selectSeason(mediaId, seasonNum) {
    genericGET(`/media/${mediaId}/seasons/${seasonNum}`);
  }

  /**
   * Fetch current popular movies from TMDb
   */
  function fetchPopularMovies() {
    genericGET(`/external/popular-movies`);
  }

  /**
   * @param {{mediaId: number, tmdbId: number}} param0 Either mediaId or tmdbId
   */
  function selectLink({ mediaId, tmdbId, type }) {
    if (mediaId) {
      genericGET(`/link?mediaId=${mediaId}`);
    } else {
      genericGET(`/link?tmdbId=${tmdbId}&type=${type}`);
    }
  }

  /**
   * @param {string} query required
   * @param {number} year optional
   */
  function fetchMovies(query, year) {
    let parms = `query=${query}`;
    if (year) parms += `&year=${year}`;
    genericGET(`/external/movies?${parms}`);
  }

  /**
   * @param {string} query required
   * @param {number} year optional
   */
  function fetchShows(query, year) {
    let parms = `query=${query}`;
    if (year) parms += `&year=${year}`;
    genericGET(`/external/shows?${parms}`);
  }

  /**
   * Fetch movie details from TMDb
   * @param {number} tmdbId
   */
  function fetchMovieDetails(tmdbId) {
    genericGET(`/external/movies/${tmdbId}`);
  }

  /**
   * Fetch show details from TMDb
   * @param {number} tmdbId
   */
  function fetchShowDetails(tmdbId) {
    genericGET(`/external/shows/${tmdbId}`);
  }

  /**
   * Fetch available torrents for movie from Yifi
   * @param {string} imdbId
   */
  function fetchMovieTorrents(imdbId) {
    genericGET(`/torrents?imdbId=${imdbId}`);
  }

  function searchMedia(title) {
    genericGET(`/search?title=${title}`);
  }
  return {
    data,
    selectMedia,
    selectMediaCollection,
    fetchPopularMovies,
    selectLink,
    fetchMovies,
    fetchShows,
    selectSeasons,
    selectSeason,
    fetchMovieDetails,
    fetchShowDetails,
    fetchMovieTorrents,
    searchMedia,
  };
}
