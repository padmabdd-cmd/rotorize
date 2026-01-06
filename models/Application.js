const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  contactNumber: String,
  aadhaarNumber: String,
  course: String,
  additionalInfo: String,

  // Uploaded Files
  tenthPassCertificate: String,
  medicalCertificate: String,
  approvedIdCards: [String],
  passportPhoto: String,

  // **Status must exist**
  status: {
    type: String,
    default: "pending",   // pending | approved | rejected | waiting
    lowercase: true
  },

  // Tracking info
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true // <-- gives createdAt & updatedAt automatically
});

module.exports = mongoose.model("Application", applicationSchema);
