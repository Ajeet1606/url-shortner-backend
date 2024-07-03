const express = require("express");
const router = express.Router();
const {
  handleGenerateNewShortUrl, handleGetShortUrl, handleGetAnalytics,
} = require("../controllers/url.controllers.js");

router.post("/shortUrl", handleGenerateNewShortUrl);
router.get("/:shortId", handleGetShortUrl);
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;