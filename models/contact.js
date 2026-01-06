const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    message: String,
    adminReply: { type: String, default: "" },
    repliedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
