import fs from "fs";
import path from "path";
import { selectMedia, selectEpisode } from "../database/reads.js";

const CHUNK_SIZE = 10 ** 6;

const MIME = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avif": "image/avif",
  ".avi": "video/x-msvideo",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mpeg": "video/mpeg",
  ".ogv": "video/ogg",
  ".ts": "video/mp2t",
  ".webm": "video/webm",
};

/**
 * @param {string} videoPath 
 * @returns {string} 
 */
function mimeType(videoPath) {
  const ext = path.extname(videoPath);
  return MIME[ext] ?? "video";
}

/**
 * @param {import('express').Request} res
 * @param {import('express').Response} res
 * @param {string} videoPath
 */
function pipeStream(req, res, videoPath) {
  const videoSize = fs.statSync(videoPath).size;

  // header.range is expected to be like -> 'bytes=0-'
  const range = req.headers.range?.match(/bytes=(?<start>[0-9]+)-.*/);
  const start = parseInt(range?.groups?.start ?? 0);
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1); // if start+chunk is past the end range, use the last byte instead

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1, // add 1 because bytes are zero-indexed
    "Content-Type": mimeType(videoPath) ?? "",
  });

  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function streamMovie(req, res) {
  const media = await selectMedia(req.params.mediaId);
  if (!media) {
    res.sendStatus(404);
    return;
  }
  if (media.type === "show") {
    res.sendStatus(400);
    return;
  }

  pipeStream(req, res, media.path);
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns 
 */
async function streamEpisode(req, res) {
  const media = await selectMedia(req.params.mediaId);
  if (!media) {
    res.sendStatus(404);
    return;
  }
  if (media.type === "movie") {
    res.sendStatus(400);
    return;
  }

  const episode = await selectEpisode(
    media.media_id,
    req.params.seasonNum,
    req.params.episodeNum
  );

  if (!episode) {
    res.sendStatus(404);
    return;
  }

  pipeStream(req, res, episode.path);
}

export default { streamMovie, streamEpisode };
