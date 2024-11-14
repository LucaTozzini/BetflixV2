/* 
This router handles all HTTP server requests.
The default export of this file is used by the express app as the main router

The standards for REST API endpoints used in this router can be found here:
https://restfulapi.net/resource-naming/

The standards for HTTP response codes was found here:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/

// #region imports
import fs from "fs";
import express from "express";
import { selectMediaCollection, selectMedia } from "../database/queries.js";
import {
  fetchPopularMovies,
  fetchMovieDetails,
  fetchMovies,
} from "./tmdbLink.js";
import { fetchMovieTorrents } from "./yifiLink.js";
import { CHUNK_SIZE, mimeType } from "./stream.js";
// #endregion

const router = express.Router();
const v1 = express.Router();

router.get("/", (req, res) => {
  res.send(`<h1>Server is Running!</h1>`);
});

// #region v1 endpoints
// #region media
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
  } else {
    /* 
  sqlite3 will return undefined if the row is not found.
  In this case send a Not Found response as the server was not able to find the resource
  */
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
// #endregion
// #region external
v1.get("/external/popular-movies", async (req, res) => {
  const popular = await fetchPopularMovies();
  res.json(popular);
});

v1.get("/external/movies", async (req, res) => {
  if (!req.query.query) {
    res.sendStatus(400);
    return;
  }
  const movies = await fetchMovies(req.query.query, req.query.year);
  res.json(movies);
});

v1.get("/external/movies/:tmdbId", async (req, res) => {
  const details = await fetchMovieDetails(req.params.tmdbId);
  res.json(details);
});

v1.get("/external/torrents/:imdbId", async (req, res) => {
  const torrents = await fetchMovieTorrents(req.params.imdbId);
  if (torrents) {
    res.json(torrents);
  } else {
    res.sendStatus(404);
  }
});
//#endregion
// #region stream
v1.get("/stream/:mediaId", async (req, res) => {
  const media = await selectMedia(req.params.mediaId);
  if (!media) {
    res.sendStatus(404);
    return;
  }
  const videoSize = fs.statSync(media.path).size;

  // header.range is expected to be like -> 'bytes=0-'
  const range = req.headers.range?.match(/bytes=(?<start>[0-9]+)-.*/);
  const start = parseInt(range?.groups?.start ?? 0);
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1); // if start+chunk is past the end range, use the last byte instead

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1, // add 1 because bytes are zero-indexed
    "Content-Type": mimeType(media.path) ?? "",
  });

  const stream = fs.createReadStream(media.path, {start, end});
  stream.pipe(res);
});

v1.get("/stream/:mediaId/s:seasonNum-e:episodeNum", async (req, res) => {
  res.send(`Season ${req.params.seasonNum} Episode ${req.params.episodeNum}`);
});
// #endregion
// #endregion

router.use("/v1", v1);
export default router;
