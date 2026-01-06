const express = require("express");
const router = express.Router();
const PageVisit = require("../models/PageVisit");

// 🔔 Track page visit
router.post("/track-visit", async (req, res) => {
  try {
    const { page } = req.body;

    await PageVisit.create({
      page,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"]
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Visit tracking error:", err.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
