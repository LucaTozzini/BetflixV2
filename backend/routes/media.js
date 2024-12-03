import mediaController from "../controllers/mediaController.js";
import express from "express";
const mediaRouter = express.Router();

mediaRouter.get("/", mediaController.mediaCollection);
mediaRouter.get("/:mediaId", mediaController.mediaDetails);
mediaRouter.get("/:mediaId/seasons", mediaController.seasons);
mediaRouter.get(
  "/:mediaId/seasons/s:seasonNum-e:episodeNum",
  mediaController.episode
);

// needs to come AFTER episode or else episode request will be interpreted as season 
mediaRouter.get("/:mediaId/seasons/:seasonNum", mediaController.season);


export default mediaRouter;
