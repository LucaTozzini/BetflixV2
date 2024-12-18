// for dev
// const SERVER = "http://localhost:5340";

// for build
const SERVER = "";

export default function usePosts() {
  async function postTorrent(fileURL) {
    const response = await fetch(`${SERVER}/torrents?fileURL=${fileURL}`, {method: "POST"})
    return response
  }

  async function postLink(mediaId, tmdbId, type) {
    const response = await fetch(`${SERVER}/link?mediaId=${mediaId}&tmdbId=${tmdbId}&type=${type}`, {method: "POST"})
    return response
  }
  
  return {postTorrent, postLink}
}