const bcrypt = require("bcryptjs");

// Generate 6-digit OTP and hash it
const generateOtp = async () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(code, salt);
  return { code, hashed };
};

module.exports = generateOtp;
