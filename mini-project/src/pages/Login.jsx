import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Boo2 from "../components/Boo2.svg";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: "390px",
    margin: "0 auto",
    backgroundColor: "#D4E1FD",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Intel One Mono', 'Courier New', monospace",
    position: "relative",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  backButton: {
    position: "absolute",
    top: "24px",
    left: "24px",
    background: "none",
    border: "2px solid #000000",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#000000",
    fontSize: "18px",
    transition: "background 0.2s, color 0.2s",
    padding: 0,
  },
  owlWrapper: {
    marginBottom: "36px",
    display: "flex",
    justifyContent: "center",
  },
  owl: {
    width: "170px",
    height: "170px",
    objectFit: "contain",
    filter: "drop-shadow(0px 4px 12px rgba(74, 108, 179, 0.25))",

  },
  card: {
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  fieldLabel: {
    fontSize: "13px",
    color: "#4a6cb3",
    fontFamily: "'Intel One Mono', 'Courier New', monospace",
    fontWeight: "700",
    marginBottom: "6px",
    marginTop: "16px",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #b8ccf5",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    fontFamily: "'Intel One Mono', 'Courier New', monospace",
    fontWeight: "700",
    color: "#2c3e6b",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  loginButton: {
    marginTop: "28px",
    width: "100%",
    padding: "16px",
    borderRadius: "50px",
    border: "2px solid #7da3e8",
    backgroundColor: "#ffffff",
    color: "#3a5fa8",

    fontFamily: "'Intel One Mono', 'Courier New', monospace",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "background 0.2s, color 0.2s, transform 0.1s",
    boxShadow: "0 2px 8px rgba(100, 149, 220, 0.18)",
  },
  errorMessage: {
    marginTop: "14px",
    textAlign: "center",
    color: "#e53e3e",
    fontSize: "13px",
    fontFamily: "'Intel One Mono', 'Courier New', monospace",
    letterSpacing: "0.01em",
    lineHeight: "1.5",
    minHeight: "20px",
  },
};

// Inject keyframe animation
const injectKeyframes = () => {
  if (document.getElementById("owl-float-style")) return;
  const style = document.createElement("style");
  style.id = "owl-float-style";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Intel+One+Mono:wght@400;600;700&display=swap');

    @keyframes owlFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }

    .login-input:focus {
      border-color: #6b8fd4 !important;
      box-shadow: 0 0 0 3px rgba(107, 143, 212, 0.18) !important;
    }

    .login-btn:hover {
      background: #d4e1fd !important;
      transform: scale(1.02);
    }

    .login-btn:active {
      transform: scale(0.98);
    }

    .back-btn:hover {
      background: rgba(107, 143, 212, 0.15) !important;
    }
  `;
  document.head.appendChild(style);
};

// Dummy credential check — replace with real API call
const VALID_EMAIL = "user@hufs.ac.kr";
const VALID_PASSWORD = "password123";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempted, setAttempted] = useState(false);

  injectKeyframes();

  const handleLogin = () => {
    setAttempted(true);
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setError("입력하신 이메일 또는 비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
      // TODO: navigate to main page after successful login
      // navigate("/main");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const inputStyle = (hasError) => ({
    ...styles.input,
    ...(hasError ? styles.inputError : {}),
  });

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button
        className="back-btn"
        style={styles.backButton}
        onClick={() => navigate("/")}
        aria-label="이전 페이지로"
      >
        ←
      </button>

      {/* Owl mascot */}
      <div style={styles.owlWrapper}>
        <img src={Boo2} alt="HUFS 부엉이 마스코트" style={styles.owl} />
      </div>

      {/* Login form */}
      <div style={styles.card}>
        <label style={styles.fieldLabel}>이메일 입력</label>
        <input
          className="login-input"
          type="email"
          style={inputStyle(attempted && !email)}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setAttempted(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder=""
          autoComplete="email"
        />

        <label style={styles.fieldLabel}>비밀번호 입력</label>
        <input
          className="login-input"
          type="password"
          style={inputStyle(attempted && !password)}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
            setAttempted(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder=""
          autoComplete="current-password"
        />

        <button
          className="login-btn"
          style={styles.loginButton}
          onClick={handleLogin}
        >
          로그인
        </button>

        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );

}