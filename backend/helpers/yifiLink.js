/* 
Allows HTTP server to interact with the Yifi API through these functions.
Documentations for the Yifi API can be found here: https://yts.mx/api
*/

const API_ADDRESS = "https://yts.mx/api/v2";

export async function fetchMovieTorrents(imdbId) {
  try {
    const response = await fetch(`${API_ADDRESS}/movie_details.json?imdb_id=${imdbId}`);
    const json = await response.json();
    return json?.data?.movie?.torrents
  } catch (err) {
    throw err;
  }
}
