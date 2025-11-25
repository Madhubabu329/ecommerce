import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after mount
    setAnimateFeatures(true);
  }, []);

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
      const res = await api.post("/auth/verify-otp", { email, code: otp, name });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* Left Illustration */}
      <div style={styles.left}>
        <img
          src="https://images.unsplash.com/photo-1586201375761-83865001e7df?auto=format&fit=crop&w=800&q=80"
          alt="Fresh groceries"
          style={styles.image}
        />
      </div>

      {/* Right Form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.logo}>🥛 DailyBasket</div>
          <h2 style={styles.title}>Fresh groceries, delivered to your doorstep</h2>

          {/* Step 1 → Name + Email */}
          {step === 1 && (
            <>
              <input
                placeholder="Your Name"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Email Address"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button style={styles.button} onClick={sendOtp}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* Step 2 → OTP */}
          {step === 2 && (
            <>
              <input
                placeholder="Enter OTP"
                style={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button style={styles.button} onClick={verifyOtp}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                disabled={timer > 0}
                onClick={sendOtp}
                style={{
                  ...styles.resend,
                  opacity: timer > 0 ? 0.5 : 1,
                  cursor: timer > 0 ? "not-allowed" : "pointer",
                }}
              >
                {timer > 0 ? `Resend OTP (${timer})` : "Resend OTP"}
              </button>
            </>
          )}

          <div style={styles.footer}>
            Don’t have an account? <span style={styles.signup}>Sign Up</span>
          </div>

          {/* Feature Highlights with animation */}
          <div style={{ ...styles.features, opacity: animateFeatures ? 1 : 0 }}>
            <div style={{ ...styles.featureItem, animationDelay: "0.1s" }}>🥦 Fresh Vegetables</div>
            <div style={{ ...styles.featureItem, animationDelay: "0.3s" }}>🥛 Daily Milk</div>
            <div style={{ ...styles.featureItem, animationDelay: "0.5s" }}>🥕 Quick Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS-in-JS styles
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    background: "#f9f9f9",
  },
  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#E8F5E9",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  image: {
    width: "80%",
    maxWidth: 500,
    borderRadius: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    color: "#333",
    lineHeight: 1.4,
  },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 16,
    outline: "none",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#FF6A00",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 10,
    transition: "0.3s",
  },
  resend: {
    width: "100%",
    padding: 12,
    fontSize: 14,
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
  },
  signup: {
    color: "#FF6A00",
    cursor: "pointer",
    fontWeight: "bold",
  },
  features: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    opacity: 0,
    animation: "fadeUp 0.6s forwards",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    opacity: 0,
    animation: "fadeUp 0.6s forwards",
  },
  // Media query for responsiveness
  "@media(max-width: 768px)": {
    wrapper: {
      flexDirection: "column",
    },
    left: {
      display: "none",
    },
    right: {
      flex: 1,
    },
  },
};

// Add keyframes for fadeUp animation
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
   }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
