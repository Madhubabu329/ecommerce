const router = require("express").Router();
const { sendOtp } = require("../controllers/otpController");
const { verifyOtp, refreshToken, logout } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
