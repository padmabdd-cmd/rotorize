const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  cardNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved" // admin-added testimonials are auto-approved
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
