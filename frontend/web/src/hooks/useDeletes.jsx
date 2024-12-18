// for dev
// const SERVER = "http://localhost:5340";

// for build
const SERVER = "";

export default function useDeletes() {
  async function deleteLink(mediaId) {
    const response = await fetch(`${SERVER}/link?mediaId=${mediaId}`, {
      method: "DELETE",
    });

    return response;
  }

  return {deleteLink};
}
