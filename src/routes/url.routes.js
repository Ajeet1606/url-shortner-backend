import express from "express";
import { handleGenerateNewShortUrl, handleGetShortUrl, handleGetAnalytics, greetings } from "../controllers/url.controllers.js";
const router = express.Router();
router.get("/hello", greetings);
router.post("/shortUrl", handleGenerateNewShortUrl);
router.get("/:shortId", handleGetShortUrl);
router.get("/analytics/:shortId", handleGetAnalytics);

export default router