const mongoose = require("mongoose");

const pageVisitSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    default: ""
  },
  userAgent: {
    type: String,
    default: ""
  },
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PageVisit", pageVisitSchema);
