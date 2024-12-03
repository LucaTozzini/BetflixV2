const SERVER = "localhost:5340";

export default function usePosts() {
  async function postTorrent(fileURL) {
    const response = await fetch(`http://${SERVER}/torrents?fileURL=${fileURL}`, {method: "POST"})
    return response
  }

  async function postLink(mediaId, tmdbId, type) {
    const response = await fetch(`http://${SERVER}/link?mediaId=${mediaId}&tmdbId=${tmdbId}&type=${type}`, {method: "POST"})
    return response
  }
  
  return {postTorrent, postLink}
}