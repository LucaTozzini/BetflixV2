const SERVER = "localhost:5340";

export default function useDeletes() {
  async function deleteLink(mediaId) {
    const response = await fetch(`http://${SERVER}/link?mediaId=${mediaId}`, {
      method: "DELETE",
    });

    return response;
  }

  return {deleteLink};
}
