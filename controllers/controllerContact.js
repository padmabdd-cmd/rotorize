const Contact = require("../models/contact");
const nodemailer = require("nodemailer");

// ================= EMAIL TRANSPORT (FIXED) =================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,          // smtp.gmail.com
  port: process.env.EMAIL_PORT,          // 587
  secure: false,                         // MUST be false for Gmail
  auth: {
    user: process.env.EMAIL_USER,        // your gmail
    pass: process.env.EMAIL_PASS         // app password
  },
  tls: {
    rejectUnauthorized: false             // FIXES certificate error
  }
});

// Verify SMTP connection
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ SMTP READY (CONTACT)");
  }
});

// ================= CONTACT FORM SUBMIT =================
exports.handleContactSubmit = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Save contact message to database
    await Contact.create({
      name,
      phone,
      email,
      message
    });

    // ========== ADMIN EMAIL ==========
    await transporter.sendMail({
      from: `"Rotorize Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Contact Enquiry – Rotorize Aviation",
      text: `
New Contact Enquiry

Name: ${name}
Phone: ${phone || "-"}
Email: ${email}

Message:
${message}
      `
    });

    // ========== USER AUTO-REPLY ==========
    if (email !== process.env.EMAIL_TO) {
      await transporter.sendMail({
        from: `"Rotorize Aviation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We received your enquiry",
        text: `Hi ${name},

Thank you for contacting Rotorize Aviation.
Your message has been received and forwarded to our team.

We will get back to you shortly.

Regards,
Rotorize Aviation`
      });
    }

    return res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN PLACEHOLDERS =================
exports.renderAdminContact = (req, res) => {
  res.send("Admin contact messages page");
};

exports.replyToContact = (req, res) => {
  res.send("Reply feature");
};
