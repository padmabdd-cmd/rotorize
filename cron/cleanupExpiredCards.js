const ApprovedCard = require("../models/ApprovedCard");

async function cleanupExpired() {
  try {
    const now = new Date();

    const result = await ApprovedCard.deleteMany({
      expiresAt: { $lte: now }
    });

    if (result.deletedCount > 0) {
      console.log(`🗑 ${result.deletedCount} expired approvals removed`);
    }
  } catch (error) {
    console.error("Cleanup Error:", error);
  }
}

module.exports = cleanupExpired;
