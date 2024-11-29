const SERVER = "localhost:5340";

export default function usePosts() {
  async function postTorrent(fileURL) {
    const response = await fetch(`http://${SERVER}/torrents?fileURL=${fileURL}`, {method: "POST"})
    return response.status
  }

  async function postLink(mediaId, tmdbId) {
    const response = await fetch(`http://${SERVER}/link?mediaId=${mediaId}&tmdbId=${tmdbId}`)
    return response.status
  }
  
  return {postTorrent, postLink}
}