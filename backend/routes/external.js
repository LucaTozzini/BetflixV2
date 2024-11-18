import externalController from "../controllers/externalController.js";
import express from "express";
const externalRouter = express.Router();

externalRouter.get(
  "/popular-movies",
  externalController.popularMovies
);
externalRouter.get("/movies", externalController.movies);
externalRouter.get("/movies/:tmdbId", externalController.movieDetails);
externalRouter.get("/torrents/:imdbId", externalController.torrents);

export default externalRouter;
