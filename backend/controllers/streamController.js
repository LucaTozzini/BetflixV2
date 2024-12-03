import fs from "fs";
import { selectMedia } from "../database/reads.js";
import { mimeType, CHUNK_SIZE } from "../helpers/stream.js";

async function streamMovie(req, res) {
  const media = await selectMedia(req.params.mediaId);
  if (!media || media.type === "show") {
    res.sendStatus(404);
    return;
  }
  const videoSize = fs.statSync(media.path).size;

  // header.range is expected to be like -> 'bytes=0-'
  const range = req.headers.range?.match(/bytes=(?<start>[0-9]+)-.*/);
  const start = parseInt(range?.groups?.start ?? 0);
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1); // if start+chunk is past the end range, use the last byte instead

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1, // add 1 because bytes are zero-indexed
    "Content-Type": mimeType(media.path) ?? "",
  });

  const stream = fs.createReadStream(media.path, { start, end });
  stream.pipe(res);
}

async function streamEpisode(req, res) {
  res.send(`Season ${req.params.seasonNum} Episode ${req.params.episodeNum}`);
}

export default { streamMovie, streamEpisode };
