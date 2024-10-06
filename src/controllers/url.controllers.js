import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import UAParser from "ua-parser-js";

async function handleGenerateNewShortUrl(req, res) {

  const shortID = nanoid(8);
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
      uniqueID: shortID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function handleGetShortUrl(req, res) {
  // const ipAddress = req.ip || req.connection.remoteAddress;
  // console.log('ipAddress', ipAddress);
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser();
  const uaResult = parser.setUA(userAgent).getResult();
  // console.log('uaResult', uaResult);

  const shortId = req.params.shortId;
  if(!shortId) return res.status(400).json({message: "Failed to get URL, please provide a valid ID."})
  try {
    const url = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            deviceConfig: {
              browser: uaResult.browser.name,
              os: uaResult.os.name,
            },
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
    // console.log(error);
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
    res.json({totalClicks: url.visitHistory.length, timeline: url.visitHistory});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function greetings(req, res){
  res.status(200).json({
    message: "Heyya, welcome Home!!"
  })
}

export {
  handleGenerateNewShortUrl,
  handleGetShortUrl,
  handleGetAnalytics,
  greetings,
}
