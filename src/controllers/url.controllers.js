const shortid = require("shortid");
const URL = require("../models/url.model");

async function handleGenerateNewShortUrl(req, res) {
  const shortID = shortid(8);
  const originalURL = req.body.url;

  if (!originalURL) {
    res.status(400).json({
      error: "URL is required",
    });
    return;
  }
  try {
    await URL.create({
      shortId: shortID,
      redirectURL: originalURL,
      visitHistory: [],
    });
    res.status(201).json({
      shortId: shortID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function handleGetShortUrl(req, res) {
  const shortId = req.params.shortId;
  try {
    const url = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    if (!url) {
      res.status(404).json({
        error: "Short URL not found",
      });
      return;
    }
    res.redirect(url.redirectURL);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  try {
    const url = await URL.findOne({ shortId });
    if (!url) {
      res.status(404).json({
        error: "Short URL not found",
      });
      return;
    }
    res.json({totalClicks: url.visitHistory.length});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetShortUrl,
  handleGetAnalytics,
};
