// ===============================
// Load Environment Variables
// ===============================
require("dotenv").config();

// ===============================
// Core Modules
// ===============================
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// ===============================
// Server Port
// ===============================
const PORT = process.env.PORT || 3000;

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===============================
// Middleware
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// View Engine
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// GLOBAL TEMPLATE VARIABLES
// ===============================
app.use((req, res, next) => {
  res.locals.meta = {
    title: "Rotorize Aviation",
    description: "Learn Professional Drone & Aviation Courses",
  };

  res.locals.site = {
    name: "Rotorize Aviation",
    url: "https://rotorize.com",
  };

  next();
});

// ===============================
// SESSION + FLASH
// ===============================
app.use(
  session({
    secret: "rotorize-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Flash globals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// ===============================
// ROUTES
// ===============================
app.use("/api", require("./routes/visitorRoutes")); // 🔔 page visit tracking

app.use("/contact", require("./routes/contact"));
app.use("/application", require("./routes/application"));
app.use("/admin", require("./routes/admin"));

// ===============================
// STATIC PAGES
// ===============================
app.get("/", (req, res) => res.render("index"));
app.get("/about", (req, res) => res.render("about"));
app.get("/services", (req, res) => res.render("services"));
app.get("/courses", (req, res) => res.render("courses"));
app.get("/portfolio", (req, res) => res.render("portfolio"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/blogs", (req, res) => res.render("blogs"));

// ===============================
// TESTIMONIALS PAGE (PUBLIC)
// ===============================
app.get("/testimonials", (req, res) => {
  res.render("testimonials", {
    meta: { title: "Testimonials | Rotorize Aviation" }
  });
});

// ===============================
// WATCH TESTIMONIAL (PUBLIC)
// ===============================
app.get("/testimonials/watch/:id", (req, res) => {
  const cardNumber = req.params.id;
  res.render("watchTestimonial", { cardNumber });
});

// ===============================
// ADMIN VIEWS
// ===============================
app.get("/admin/applications", (req, res) =>
  res.render("adminApplications")
);

app.get("/admin/contact", (req, res) =>
  res.redirect("/contact/admin/messages")
);

app.get("/admin/request", (req, res) =>
  res.render("adminRequest")
);

app.get("/admin/testimonials-view", (req, res) =>
  res.render("testimonialAdmin")
);

// ===============================
// 404 FALLBACK
// ===============================
app.use((req, res) => {
  res.status(404).render("404");
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
