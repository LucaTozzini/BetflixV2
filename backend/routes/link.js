import express from "express"
import linkController from "../controllers/linkController"
const linkRouter = express.Router()

linkRouter.post("/", linkController.linkMedia)

export default linkRouter