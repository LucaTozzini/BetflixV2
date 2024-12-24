import externalController from "../controllers/externalController.js";
import express from "express";
const externalRouter = express.Router();

externalRouter.get("/popular-movies", externalController.popularMovies);
externalRouter.get("/movies", externalController.movies);
externalRouter.get("/movies/:tmdbId", externalController.movieDetails);
externalRouter.get("/movies/:tmdbId/images", externalController.movieImages);
externalRouter.get("/shows", externalController.shows);
externalRouter.get("/shows/:tmdbId", externalController.showDetails);
externalRouter.get("/shows/:tmdbId/images", externalController.showImages);

export default externalRouter;
