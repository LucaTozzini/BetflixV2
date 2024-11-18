import { selectMediaCollection, selectMedia } from "../database/queries";

async function mediaCollection(req, res) {
  const mediaCollection = await selectMediaCollection(
    req.query.offset,
    req.query.limit,
    req.query.order,
    req.query.desc === "true", // convert from string to bool
    req.query.type
  );
  res.json(mediaCollection);
}

async function mediaDetails(req, res) {
  const media = await selectMedia(req.params.mediaId);
  if (media) {
    res.json(media);
  } else {
    /* 
  sqlite3 will return undefined if the row is not found.
  In this case send a Not Found response as the server was not able to find the resource
  */
    res.sendStatus(404);
  }
}

async function seasons(req, res) {
  res.json();
}

async function season(req, res) {
  res.json()
}

async function episode(req, res) {
  res.json()
} 

export default {
  mediaCollection, mediaDetails, seasons, season, episode
}