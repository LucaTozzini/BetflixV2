import { useState } from "react";
const SERVER = "localhost:5340";

export default function useQueries() {
  const [data, setData] = useState(null);

  function parString(key, value) {
    return !value || !key ? null : `${key}=${value}`;
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

    const response = await fetch(`http://${SERVER}/v1/media?${queryParams}`);
    const json = await response.json();

    setData(json);
  }

  /**
   * @param {number} mediaId 
   */
  async function selectMedia(mediaId) {
    const response = await fetch(`http://${SERVER}/v1/media/${mediaId}`);
    const json = await response.json();
    setData(json);
  }

  async function fetchPopularMovies() {
    const response = await fetch(`http://${SERVER}/v1/popular-movies`);
    const json = await response.json();
    console.log(json)
    setData(json);
  }

  return { data, selectMedia, selectMediaCollection, fetchPopularMovies };
}
