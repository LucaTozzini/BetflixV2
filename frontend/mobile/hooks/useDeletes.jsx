import { useContext } from "react";
import ServerContext from "../contexts/serverContext";

export default function useDeletes() {
  const serverAddress = useContext(ServerContext);
  async function deleteLink(mediaId) {
    try {
      const url = `http://${serverAddress}/link?mediaId=${mediaId}`;
      const options = { method: "DELETE" };
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      console.error(err.message);
    }
  }

  return { deleteLink };
}
