const Application = require("../models/Application");
const nodemailer = require("nodemailer");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// ======================================================
// 📧 Email Transporter
// ======================================================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

const ADMIN_EMAIL = process.env.EMAIL_TO || process.env.EMAIL_USER;

// ======================================================
// USER — Submit Application
// ======================================================
exports.handleApplicationSubmit = async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      contactNumber,
      aadhaarNumber,
      course,
      additionalInfo
    } = req.body;

    if (!username || !fullName || !email || !contactNumber || !aadhaarNumber || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // FILES
    const tenthPassCertificate = req.files?.tenthPassCertificate?.[0];
    const medicalCertificate = req.files?.medicalCertificate?.[0];
    const idCards = req.files?.idCards;
    const passportPhoto = req.files?.passportPhoto?.[0];

    if (!tenthPassCertificate || !medicalCertificate || !idCards || !passportPhoto) {
      return res.status(400).json({ message: "All files are required" });
    }

    const newApp = await Application.create({
      username,
      fullName,
      email,
      contactNumber,
      aadhaarNumber,
      course,
      additionalInfo,
      tenthPassCertificate: tenthPassCertificate.filename,
      medicalCertificate: medicalCertificate.filename,
      approvedIdCards: idCards.map(f => f.filename),
      passportPhoto: passportPhoto.filename,
      status: "Submitted",
      adminNotes: "",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // ======================================================
    // 📄 Generate PDF Acknowledgement
    // ======================================================
    const pdfName = `${newApp._id}_acknowledgement.pdf`;
    const pdfPath = path.join("public/uploads", pdfName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).text("Rotorize Aviation — Application Acknowledgement", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Application ID: ${newApp._id}`);
    doc.text(`Name: ${fullName}`);
    doc.text(`Course: ${course}`);
    doc.text(`Status: Submitted`);
    doc.text(`Date: ${new Date().toDateString()}`);
    doc.end();

    // EMAILS
    await sendStatusEmail(email, fullName, "Submitted", newApp._id, pdfPath);
    await sendAdminNotification(newApp, req.files); // ✅ PASS FILES

    res.status(200).json({
      message: "Application submitted successfully",
      appId: newApp._id
    });

  } catch (err) {
    console.error("❌ Submission Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================================
// USER — Track Application
// ======================================================
exports.renderTrackStatus = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).render("404");

    res.render("trackApplication", { app });
  } catch (err) {
    console.error("❌ Track Error:", err);
    res.status(500).send("Server Error");
  }
};

// ======================================================
// ADMIN — List Applications
// ======================================================
exports.renderAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.render("admin/applications", { applications });
  } catch (err) {
    console.error("❌ Admin List Error:", err);
    res.status(500).send("Server Error");
  }
};

// ======================================================
// ADMIN — Edit Status Page
// ======================================================
exports.renderAdminStatusEdit = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).send("Application not found");

    res.render("admin/editStatus", { app });
  } catch (err) {
    console.error("❌ Admin Edit Error:", err);
    res.status(500).send("Server Error");
  }
};

// ======================================================
// ADMIN — Update Status
// ======================================================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!app) return res.status(404).send("Application not found");

    await sendStatusEmail(app.email, app.fullName, status, app._id);

    res.redirect("/application/admin/list");
  } catch (err) {
    console.error("❌ Update Status Error:", err);
    res.status(500).send("Server Error");
  }
};

// ======================================================
// EMAIL — Send Status Email to User
// ======================================================
async function sendStatusEmail(email, name, status, appId, attachment = null) {
  const mail = {
    from: `"Rotorize Aviation" <${process.env.EMAIL_USER}>`,
    to: email,
    cc: ADMIN_EMAIL,
    subject: "Rotorize Aviation — Application Status",
    html: `
      <h3>Hello ${name},</h3>
      <p>Your application status:</p>
      <h2>${status}</h2>
      <a href="${process.env.BASE_URL}/application/track/${appId}">
        Track Application
      </a>
      <p>— Rotorize Aviation</p>
    `
  };

  if (attachment) {
    mail.attachments = [{ filename: "Acknowledgement.pdf", path: attachment }];
  }

  await transporter.sendMail(mail);
}

// ======================================================
// 📧 ADMIN EMAIL — WITH DOCUMENT ATTACHMENTS
// ======================================================
async function sendAdminNotification(app, files) {
  const attachments = [];

  if (files.tenthPassCertificate?.[0]) {
    attachments.push({
      filename: files.tenthPassCertificate[0].originalname,
      path: files.tenthPassCertificate[0].path
    });
  }

  if (files.medicalCertificate?.[0]) {
    attachments.push({
      filename: files.medicalCertificate[0].originalname,
      path: files.medicalCertificate[0].path
    });
  }

  if (files.passportPhoto?.[0]) {
    attachments.push({
      filename: files.passportPhoto[0].originalname,
      path: files.passportPhoto[0].path
    });
  }

  if (files.idCards) {
    files.idCards.forEach((file, index) => {
      attachments.push({
        filename: `ID_${index + 1}_${file.originalname}`,
        path: file.path
      });
    });
  }

  await transporter.sendMail({
    from: `"Rotorize Aviation" <${process.env.EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New Application — ${app.fullName}`,
    html: `
      <h3>New Application Received</h3>
      <p><b>Name:</b> ${app.fullName}</p>
      <p><b>Course:</b> ${app.course}</p>
      <p><b>Application ID:</b> ${app._id}</p>
    `,
    attachments
  });
}
