const express = require("express");
const router = express.Router();

router.use(function (error, req, res, next) {
  res.status(500).send("Error detected", error.message);
});

router.get("*", function(req, res) {
  res.status(404).send("This page does not exists.");
});

module.exports = router;