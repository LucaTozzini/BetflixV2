import express from "express";
import torrentsController from "../controllers/torrentsController.js";

const torrentsRouter = express.Router();

torrentsRouter.post("/", torrentsController.postTorrent);

export default torrentsRouter;
