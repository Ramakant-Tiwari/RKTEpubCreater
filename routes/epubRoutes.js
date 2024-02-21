const express = require("express");
const router = express.Router();

const epubGenerator = require("../epubGenerator");
const fs = require("fs").promises;

router.post("/generate-epub", async (req, res, next) => {
  try {
    const url = req.body.url;
    const [chapterOne, epubName, fileName] = await epubGenerator.findChapterOne(url);
    if (!fileName) {
      throw new Error("There may be some error with URL");
    };
    epubGenerator.createEpub(chapterOne, url);
    res.json({"epub": epubName, "file": fileName});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/check-status", async (req, res, next) => {
  const filePath = req.body.epub;
  try {
    await fs.access(filePath, fs.constants.F_OK);
    res.json({"generated": true});
  } catch (error) {
    if (error.code === "ENOENT") {
      res.json({"generated": false})
    } else {
      console.error(error);
      next(error);
    }
  }
});

router.post("/download-epub", async (req, res, next) => {
  try {
    const filePath = req.body.epub;
    res.download(filePath);
  } catch (error) {
    console.error("Error in file transmission:", error);
    next(error);
  }
});

module.exports = router;