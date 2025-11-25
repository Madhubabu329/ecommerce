const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Otp", otpSchema);
