const Otp = require("../models/Otp");

module.exports = async function otpRateLimit(req, res, next) {
  const { email } = req.body;
  const TIME_LIMIT = 15 * 60 * 1000;
  const MAX_ATTEMPTS = 5;

  const count = await Otp.countDocuments({
    email,
    createdAt: { $gte: new Date(Date.now() - TIME_LIMIT) },
  });

  if (count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many OTP requests. Try again later.",
    });
  }

  next();
};
