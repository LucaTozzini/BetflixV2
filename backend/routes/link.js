import linkController from "../controllers/linkController.js";
import express from "express";
const linkRouter = express.Router();

linkRouter.post("/", linkController.post);
linkRouter.delete("/", linkController.del);
linkRouter.get("/", linkController.get);

export default linkRouter;
