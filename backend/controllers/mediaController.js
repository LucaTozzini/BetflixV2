import {
  selectMediaCollection,
  selectMedia,
  existsMediaId,
  selectSeasons,
  selectSeason,
  selectEpisode,
} from "../database/reads.js";

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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function seasons(req, res) {
  if (isNaN(req.params.mediaId)) {
    res.sendStatus(400);
    return;
  }
  if (!(await existsMediaId(req.params.mediaId))) {
    res.sendStatus(404);
    return;
  }
  const data = await selectSeasons(req.params.mediaId);
  res.json(data);
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function season(req, res) {
  if (isNaN(req.params.mediaId) || isNaN(req.params.seasonNum)) {
    res.sendStatus(400);
    return;
  }
  if (!(await existsMediaId(req.params.mediaId))) {
    res.sendStatus(404);
    return;
  }
  const data = await selectSeason(req.params.mediaId, req.params.seasonNum);

  if (data.length === 0) {
    res.sendStatus(404);
    return;
  }

  res.json(data);
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function episode(req, res) {
  if (
    isNaN(req.params.mediaId) ||
    isNaN(req.params.seasonNum) ||
    isNaN(req.params.episodeNum)
  ) {
    res.sendStatus(400);
    return;
  }
  if (!(await existsMediaId(req.params.mediaId))) {
    res.sendStatus(404);
    return;
  }

  const data = await selectEpisode(
    req.params.mediaId,
    req.params.seasonNum,
    req.params.episodeNum
  );


  if (!data) {
    res.sendStatus(404);
    return;
  }

  res.json(data);
}

export default {
  mediaCollection,
  mediaDetails,
  seasons,
  season,
  episode,
};
