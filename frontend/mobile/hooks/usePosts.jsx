import { useContext } from "react";
import ServerContext from "../contexts/serverContext";
export default function usePosts() {
  const serverAddress = useContext(ServerContext)
  async function postTorrent(fileURL) {
    const response = await fetch(`http://${serverAddress}/torrents?fileURL=${fileURL}`, {method: "POST"})
    return response
  }

  async function postLink(mediaId, tmdbId, type) {
    const response = await fetch(`http://${serverAddress}/link?mediaId=${mediaId}&tmdbId=${tmdbId}&type=${type}`, {method: "POST"})
    return response
  }
  
  return {postTorrent, postLink}
}