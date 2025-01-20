import express from "express";
import path from "path";
import fs from "fs";
const dir = path.resolve("./view");
const webappRouter = express.Router();

// Serve static files from the "dist" directory
webappRouter.use((req, res) => {
  const filePath = path.join(dir, req.url);

  // if url contains an extension, assume request is looking for a file
  if (path.extname(req.url)) {
    if (!fs.existsSync(filePath)) res.sendStatus(404);
    else res.sendFile(filePath);
    return;
  }

  // If not looking for a file, its a webapp route, so let react router handle it
  res.sendFile(path.join(dir, "index.html"));
});
export default webappRouter;
