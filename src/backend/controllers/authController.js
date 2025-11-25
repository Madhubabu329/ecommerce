const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const User = require("../models/User");
const Token = require("../models/Token");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokens");

exports.verifyOtp = async (req, res) => {
  try {
    const { email, code, name } = req.body;
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const valid = await bcrypt.compare(code, otpRecord.code);
    if (!valid) return res.status(400).json({ message: "Invalid OTP" });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name });

    await Otp.deleteMany({ email });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.create({ userId: user._id, token: refreshToken });

    res.json({ message: "Login successful", user, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  const stored = await Token.findOne({ token: refreshToken });
  if (!stored) return res.status(401).json({ message: "Invalid refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Expired refresh token" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  await Token.deleteOne({ token: refreshToken });
  res.json({ message: "Logged out successfully" });
};
