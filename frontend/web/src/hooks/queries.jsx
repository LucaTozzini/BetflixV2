import { useState } from "react";
const SERVER = "localhost:5340";

export default function Queries() {
  const [data, setData] = useState([]);

  function parString(key, value) {
    return !value || !key ? null : `${key}=${value}`;
  }

  /**
   * @param {number} offset 
   * @param {number} limit 
   * @param {string} order 
   * @param {string} type 
   */
  async function queryMedia(offset, limit, order, desc, type) {
    const queryParams = `${[
      parString("offset", offset),
      parString("limit", limit),
      parString("order", order),
      parString("desc", desc),
      parString("type", type),
    ]
      .filter((i) => i)
      .join("&")}`;

    console.log(`http://${SERVER}/v1/media?${queryParams}`)
    const response = await fetch(`http://${SERVER}/v1/media?${queryParams}`);
    const json = await response.json();

    setData(json);
  }

  return { data, queryMedia };
}
