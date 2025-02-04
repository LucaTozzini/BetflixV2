import { useState, useContext } from "react";
import ServerContext from "../contexts/serverContext";

export default function useQueries() {
  const serverAddress = useContext(ServerContext)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  function parString(key, value) {
    return !value || !key ? null : `${key}=${value}`;
  }

  function reset() {
    setData(null);
  }

  /**
   * @param {string} endpoint
   */
  async function genericGET(endpoint) {
    try {
      setLoading(true);
      const response = await fetch(`http://${serverAddress}${endpoint}`);
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        console.error(
          "genericGET NOT OK on",
          `http://${SERVER}${endpoint}`,
          "status",
          response.status
        );
        setData(null);
      }
    } catch(err) {

    }
    setLoading(false);
  }

  /**
   * @param {number} offset
   * @param {number} limit
   * @param {string} order
   * @param {string} type
   */
  async function selectMediaCollection(offset, limit, order, desc, type) {
    const queryParams = `${[
      parString("offset", offset),
      parString("limit", limit),
      parString("order", order),
      parString("desc", desc),
      parString("type", type),
    ]
      .filter((i) => i)
      .join("&")}`;

    await genericGET(`/media?${queryParams}`);
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
  async function fetchPopularMovies() {
    await genericGET(`/external/popular-movies`);
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

  function fetchMovieImages(tmdbId, language) {
    genericGET(`/external/movies/${tmdbId}/images?language=${language}`)
  }

  /**
   * Fetch show details from TMDb
   * @param {number} tmdbId
   */
  function fetchShowDetails(tmdbId) {
    genericGET(`/external/shows/${tmdbId}`);
  }

  function fetchShowImages(tmdbId, language) {
    genericGET(`/external/shows/${tmdbId}/images?language=${language}`)
  }

  /**
   * Fetch available torrents for movie from Yifi
   * @param {string} imdbId
   */
  function fetchMovieTorrents(imdbId) {
    genericGET(`/torrents?imdbId=${imdbId}`);
  }

  function fetchSeasonDetails(tmdbId, seasonNum) {
    genericGET(`/external/shows/${tmdbId}/seasons/${seasonNum}`);
  }

  function searchMedia(title) {
    genericGET(`/search?title=${title}`);
  }


  return {
    data,
    reset,
    loading,
    selectMedia,
    selectMediaCollection,
    fetchPopularMovies,
    selectLink,
    fetchMovies,
    fetchShows,
    selectSeasons,
    selectSeason,
    fetchMovieDetails,
    fetchMovieImages,
    fetchShowDetails,
    fetchShowImages,
    fetchMovieTorrents,
    searchMedia,
    fetchSeasonDetails,
  };
}
