import mediaController from "../controllers/mediaController.js";
import express from "express";
const mediaRouter = express.Router();

mediaRouter.get("/", mediaController.mediaCollection);
mediaRouter.get("/:mediaId", mediaController.mediaDetails);
mediaRouter.get("/:mediaId/seasons", mediaController.seasons);
mediaRouter.get("/:mediaId/seasons/:seasonNum", mediaController.season);
mediaRouter.get(
  "/:mediaId/seasons/s:seasonNum-e:episodeNum",
  mediaController.episode
);

export default mediaRouter;
