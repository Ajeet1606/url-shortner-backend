import express from "express";
import { handleGenerateNewShortUrl, handleGetShortUrl, handleGetAnalytics } from "../controllers/url.controllers.js";
const router = express.Router();

router.post("/shortUrl", handleGenerateNewShortUrl);
router.get("/:shortId", handleGetShortUrl);
router.get("/analytics/:shortId", handleGetAnalytics);

export default router