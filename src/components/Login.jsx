import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {}, 200);
  }, []);

  // --------------------------
  // OTP LOGIC
  // --------------------------
  const handleOtpChange = (value, index) => {
    if (/[^0-9]/.test(value)) return; // Only numbers

    const updatedOtp = [...otpBoxes];
    updatedOtp[index] = value;
    setOtpBoxes(updatedOtp);
    setOtp(updatedOtp.join(""));

    // auto move next
    if (value && index < 5) {
      document.getElementById(`otp-box-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      document.getElementById(`otp-box-${index - 1}`).focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(text)) return;

    const arr = text.split("");
    setOtpBoxes(arr);
    setOtp(text);

    document.getElementById("otp-box-5").focus();
  };

  // TIMER
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    if (!email) return alert("Please enter email");

    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { email, name });
      alert(res.data.message);
      setStep(2);
      startTimer();
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        code: otp,
        name,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
    setLoading(false);
  };

  // FEATURES
  const features = [
    { icon: "🥦", text: "Fresh Vegetables" },
    { icon: "🥛", text: "Daily Milk" },
    { icon: "🥕", text: "Quick Delivery" },
  ];

  const badges = [
    { icon: "🚚", text: "Free Delivery", color: "#E0F7FA" },
    { icon: "💵", text: "Cash on Delivery", color: "#FFF3E0" },
    { icon: "⏱️", text: "Quick Delivery", color: "#E8F5E9" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* FLOATING BUBBLES */}
      <div style={styles.bubble1}></div>
      <div style={styles.bubble2}></div>
      <div style={styles.bubble3}></div>

      {/* LEFT SIDE IMAGE */}
      <div style={styles.left}>
        <img
          src="https://tractorguru.in/blog/wp-content/uploads/2023/03/Top-7-Vegetable-Farming.jpg"
          alt="Groceries"
          style={styles.image}
        />
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.logo}>🥛 DailyBasket</h2>
          <p style={styles.title}>Fresh groceries delivered to your doorstep</p>

          {/* STEP 1 → Name + Email */}
          {step === 1 && (
            <>
              <input
                placeholder="Your Name"
                className="loginInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Email Address"
                className="loginInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                style={{
                  ...styles.button,
                  ...(hoveredButton ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                onClick={sendOtp}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 → OTP VERIFICATION */}
          {step === 2 && (
            <>
              <p style={{ marginBottom: 10, color: "#555" }}>
                OTP sent to <b>{email}</b>
              </p>

              <div style={styles.otpContainer}>
                {otpBoxes.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-box-${index}`}
                    value={digit}
                    maxLength={1}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={index === 0 ? handleOtpPaste : null}
                    style={styles.otpBox}
                  />
                ))}
              </div>

              <button
                style={{
                  ...styles.button,
                  ...(hoveredButton ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                onClick={verifyOtp}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                disabled={timer > 0}
                onClick={sendOtp}
                style={{
                  ...styles.resend,
                  opacity: timer > 0 ? 0.4 : 1,
                }}
              >
                {timer > 0 ? `Resend OTP (${timer})` : "Resend OTP"}
              </button>
            </>
          )}

          {/* FEATURES */}
          <div style={styles.features}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  ...styles.featureItem,
                  ...(hoveredFeature === i ? styles.featureItemHover : {}),
                }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {f.icon} {f.text}
              </div>
            ))}
          </div>

          {/* BADGES */}
          <div style={styles.badges}>
            {badges.map((b, i) => (
              <div
                key={i}
                style={{
                  ...styles.badgeItem,
                  backgroundColor: b.color,
                  ...(hoveredBadge === i ? styles.badgeItemHover : {}),
                }}
                onMouseEnter={() => setHoveredBadge(i)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
                STYLES
----------------------------------------------*/
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #F9FFF9, #E8FDEB)",
    position: "relative",
    overflow: "hidden",
  },

  bubble1: {
    position: "absolute",
    width: 120,
    height: 120,
    background: "rgba(76, 175, 80, 0.15)",
    borderRadius: "50%",
    top: "10%",
    left: "5%",
    animation: "float 6s infinite ease-in-out",
  },
  bubble2: {
    position: "absolute",
    width: 180,
    height: 180,
    background: "rgba(255, 165, 0, 0.15)",
    borderRadius: "50%",
    bottom: "8%",
    right: "10%",
    animation: "float 9s infinite ease-in-out",
  },
  bubble3: {
    position: "absolute",
    width: 80,
    height: 80,
    background: "rgba(0, 200, 255, 0.18)",
    borderRadius: "50%",
    bottom: "20%",
    left: "20%",
    animation: "float 7s infinite ease-in-out",
  },

  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  image: {
    width: "80%",
    maxWidth: 500,
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: 40,
    borderRadius: 18,
    boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
    animation: "cardZoom 0.5s ease-out",
  },

  logo: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 25,
    color: "#444",
  },

  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    background: "#FF6A00",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    marginBottom: 12,
    cursor: "pointer",
    transition: "0.3s",
  },

  buttonHover: {
    transform: "scale(1.06)",
    boxShadow: "0 8px 25px rgba(255, 106, 0, 0.45)",
  },

  resend: {
    width: "100%",
    padding: 12,
    fontSize: 14,
    background: "#333",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },

  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  otpBox: {
    width: 45,
    height: 55,
    fontSize: 24,
    textAlign: "center",
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
  },

  features: {
    marginTop: 25,
    display: "flex",
    justifyContent: "space-between",
  },

  featureItem: {
    fontSize: 14,
    color: "#388e3c",
    fontWeight: "600",
    transition: "0.3s",
    cursor: "pointer",
  },

  featureItemHover: {
    transform: "translateY(-5px)",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    padding: "2px 6px",
    borderRadius: 6,
  },

  badges: {
    marginTop: 15,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },

  badgeItem: {
    padding: "6px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "0.3s",
    cursor: "pointer",
  },

  badgeItemHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    animation: "shimmer 1.5s infinite",
  },
};

/* ---------------------------------------------
    GLOBAL INPUT + ANIMATIONS
----------------------------------------------*/

const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  .loginInput {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid #ddd;
    font-size: 15px;
    margin-bottom: 12px;
    outline: none;
    transition: 0.25s;
    background: #fff;
  }

  .loginInput:hover,
  .otpBox:hover {
    border-color: #4CAF50 !important;
  }

  .loginInput:focus,
  .otpBox:focus {
    border-color: #4CAF50 !important;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.35) !important;
    transform: scale(1.03);
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @keyframes cardZoom {
    0% { transform: scale(0.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(globalStyle);
