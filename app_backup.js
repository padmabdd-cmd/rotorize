// ===============================
//  Imports & Setup
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const basicAuth = require("basic-auth");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ===============================
//  Middleware
// ===============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// ===============================
//  MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
//  Existing Site Routes
// ===============================
// ⚠️ Keep all your current routes below this comment.
// Example:
// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.get("/about", (req, res) => {
//   res.render("about");
// });
// ✅ Don’t remove or rename any existing routes.


// ===============================
//  NEW: Access Request System
// ===============================

// ✅ Mongoose Model for Access Requests
const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  reason: String,
  date: { type: Date, default: Date.now },
});
const AccessRequest = mongoose.model("AccessRequest", requestSchema);

// ✅ Handle Form Submission (from testimonials page)
app.post("/request-access", async (req, res) => {
  try {
    const { name, email, reason } = req.body;

    // Save to MongoDB
    const newRequest = new AccessRequest({ name, email, reason });
    await newRequest.save();

    console.log(`📥 New Access Request from ${name} (${email})`);

    // ✅ Optional: Send Admin Notification Email
    if (process.env.ADMIN_EMAIL && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Rotorize Aviation" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Access Request Submitted",
        text: `New access request:\n\nName: ${name}\nEmail: ${email}\nReason: ${reason}`,
      });

      console.log("📧 Admin notified by email.");
    }

    // Respond to frontend (AJAX-friendly)
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("❌ Error saving access request:", error);
    res.status(500).send({ success: false });
  }
});

// ✅ Simple Admin Auth (Basic Login Protection)
app.use("/admin", (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== process.env.ADMIN_USER || user.pass !== process.env.ADMIN_PASS) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Authentication required.");
  }
  next();
});

// ✅ Admin Dashboard to View Requests
app.get("/admin/requests", async (req, res) => {
  try {
    const requests = await AccessRequest.find().sort({ date: -1 });
    res.render("adminRequests", { requests });
  } catch (error) {
    console.error("❌ Error loading requests:", error);
    res.status(500).send("Error loading requests.");
  }
});

// ===============================
//  Start Server
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
