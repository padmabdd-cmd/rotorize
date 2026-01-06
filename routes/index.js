const express = require("express");
const router = express.Router();

// SITE GLOBAL DATA
const site = {
  name: "Rotorize Aviation",
  logo: "/images/logo2.png"
};

// Home Page
router.get("/", (req, res) => {
  res.render("index", {
    meta: { title: "Rotorize Aviation" },
    site
  });
});

// About Page
router.get("/about", (req, res) => {
  res.render("about", {
    meta: { title: "About Us | Rotorize Aviation" },
    site
  });
});

// Courses Page
router.get("/courses", (req, res) => {
  res.render("courses", {
    meta: { title: "Courses | Rotorize Aviation" },
    site
  });
});

// Blogs Page
router.get("/blogs", (req, res) => {
  res.render("blogs", {
    meta: { title: "Blogs | Rotorize Aviation" },
    site
  });
});

// Portfolio Page
router.get("/portfolio", (req, res) => {
  res.render("portfolio", {
    meta: { title: "Portfolio | Rotorize Aviation" },
    site
  });
});

// FAQ Page
router.get("/faq", (req, res) => {
  res.render("faq", {
    meta: { title: "FAQ | Rotorize Aviation" },
    site
  });
});

// Services Page
router.get("/services", (req, res) => {
  res.render("services", {
    meta: { title: "Services | Rotorize Aviation" },
    site
  });
});

module.exports = router;
