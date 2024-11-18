import streamController from "../controllers/streamController.js";
import express from "express";
const streamRouter = express.Router();

streamRouter.get("/:mediaId", streamController.streamMovie);
streamRouter.get(
  "/:mediaId/s:seasonNum-e:episodeNum",
  streamController.streamEpisode
);

export default streamRouter;
