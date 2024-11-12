/* 
This router handles all HTTP server requests.
The default export of this file is used by the express app as the main router

The standards for REST API endpoints used in this router can be found here:
https://restfulapi.net/resource-naming/

The standards for HTTP response codes was found here:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/

import express from "express";
import { selectMediaCollection, selectMedia } from "../database/queries.js";
import { fetchPopularMovies } from "./tmdbLink.js";
const router = express.Router();
const v1 = express.Router();

router.get("/", (req, res) => {
  res.send(`<h1>Server is Running!</h1>`);
});

// #region v1 endpoints
v1.get("/media", async (req, res) => {
  const mediaCollection = await selectMediaCollection(
    req.query.offset,
    req.query.limit,
    req.query.order,
    req.query.desc === "true", // convert from string to bool
    req.query.type
  );
  res.json(mediaCollection);
});

v1.get("/media/:mediaId", async (req, res) => {
  const media = await selectMedia(req.params.mediaId);
  if (media) {
    res.json(media);
  } 
  /* 
  sqlite3 will return undefined if the row is not found.
  In this case send a Not Found response as the server was not able to find the resource
  */
  else {
    res.sendStatus(404);
  }
});

v1.get("/media/:mediaId/seasons", async (req, res) => {
  res.json();
});

v1.get("/media/:mediaId/seasons/:seasonNum", async (req, res) => {
  res.json();
});

v1.get("/media/:mediaId/seasons/:seasonNum/episodes", async (req, res) => {
  res.json();
});

v1.get(
  "/media/:mediaId/seasons/:seasonNum/episodes/:episodeNum",
  async (req, res) => {
    res.json();
  }
);

v1.get("/popular-movies", async (req, res) => {
  const popular = await fetchPopularMovies();
  res.json(popular);
})
// #endregion

router.use("/v1", v1);
export default router;
