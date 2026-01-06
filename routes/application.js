// routes/application.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const controller = require("../controllers/controllerApplication");

const uploadPath = path.join(__dirname, "..", "public", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});

const upload = multer({ storage });

router.get("/", (req, res) => {
  res.render("application"); 
});

router.post(
  "/submit",
  upload.fields([
    { name: "tenthPassCertificate", maxCount: 1 },
    { name: "medicalCertificate", maxCount: 1 },
    { name: "idCards", maxCount: 5 },       // ✔ MATCHES your form input
    { name: "passportPhoto", maxCount: 1 }
  ]),
  controller.handleApplicationSubmit
);

router.get("/track/:id", controller.renderTrackStatus);

router.get("/admin/list", controller.renderAdminApplications);
router.get("/admin/edit/:id", controller.renderAdminStatusEdit);
router.post("/admin/status/:id", controller.updateApplicationStatus);

module.exports = router;
