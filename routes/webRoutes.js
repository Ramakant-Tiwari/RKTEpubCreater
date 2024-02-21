const express = require("express");
const router = express.Router();

const epubGenerator = require("../epubGenerator");

router.route("/").get(function(req, res) {
  res.render("index.ejs");
}).post(function (req, res) {
  res.status(200).render("loading.ejs", {url: req.body.url});
});

module.exports = router;