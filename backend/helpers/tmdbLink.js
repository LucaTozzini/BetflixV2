import dotenv from "dotenv";
dotenv.config();

const API_ADDRESS = "https://api.themoviedb.org/3";

/**
 * Fetch the current popular movies on TMDb
 * @returns {Promise<json>}
 */
export async function fetchPopularMovies() {
  try {
    const url = `${API_ADDRESS}/movie/popular?language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const {results} = await response.json();
    return results;
  } catch (err) {
    throw err;
  }
}
