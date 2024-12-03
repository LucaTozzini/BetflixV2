import express from "express";
import torrentsController from "../controllers/torrentsController.js";

const torrentsRouter = express.Router();

torrentsRouter.post("/", torrentsController.post);
torrentsRouter.get("/", torrentsController.get);

export default torrentsRouter;
