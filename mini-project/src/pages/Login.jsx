import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Boo3 from '../assets/Boo3.svg';
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";

const injectStyles = () => {
  if (document.getElementById("login-styles")) return;
  const style = document.createElement("style");
  style.id = "login-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Intel+One+Mono:wght@400;600;700&display=swap');

    @keyframes owlFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .login-owl { animation: owlFloat 3s ease-in-out infinite; }

    .login-input:focus {
      border-color: #7999E9 !important;
      box-shadow: 0 0 0 3px rgba(121, 153, 233, 0.2) !important;
    }
    .login-btn:hover { background: #D4E1FD !important; transform: scale(1.02); }
    .login-btn:active { transform: scale(0.98); }
  `;
  document.head.appendChild(style);
};

const VALID_EMAIL = "user@hufs.ac.kr";
const VALID_PASSWORD = "password123";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempted, setAttempted] = useState(false);

  injectStyles();

  const handleLogin = () => {
    setAttempted(true);
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setError("입력하신 이메일 또는 비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
      navigate("/main");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 32px", boxSizing: "border-box", position: "relative",
    }}>
      {/* 이전 버튼 */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "24px", left: "24px",
          background: "none", border: "none",
          cursor: "pointer", padding: 0,
        }}
      >
        <img src={BackArrow} alt="이전" style={{ width: "40px", height: "40px" }} />
      </button>

      {/* 말풍선 */}
      <div style={{ position: "relative", marginBottom: "8px" }}>
        <div style={{
          background: "#fff", border: `2px solid ${BORDER}`,
          borderRadius: "20px", padding: "8px 16px",
          fontSize: "14px", fontWeight: "700", color: BLUE, fontFamily: FONT,
        }}>
          HUFS LOGIN
        </div>
        <div style={{
          position: "absolute", bottom: "-10px", left: "50%",
          transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `10px solid ${BORDER}`,
        }} />
      </div>

      {/* 부엉이 */}
      <img
        src={Boo3}
        alt="HUFS 부엉이 마스코트"
        className="login-owl"
        style={{
          width: "170px", height: "170px",
          objectFit: "contain", marginBottom: "32px",
          filter: "drop-shadow(0px 4px 12px rgba(74, 108, 179, 0.25))",
        }}
      />

      {/* 폼 영역 */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <label style={{
          fontSize: "13px", color: BLUE, fontWeight: "700",
          marginBottom: "6px", letterSpacing: "0.02em",
        }}>
          이메일 입력
        </label>
        <input
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); setAttempted(false); }}
          onKeyDown={handleKeyDown}
          autoComplete="email"
          style={{
            width: "100%", padding: "14px 16px",
            border: `3px solid ${attempted && !email ? "#e53e3e" : BORDER}`,
            borderRadius: "12px", backgroundColor: "#fff",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            color: "#2c3e6b", outline: "none", boxSizing: "border-box",
          }}
        />

        <label style={{
          fontSize: "13px", color: BLUE, fontWeight: "700",
          marginBottom: "6px", marginTop: "16px", letterSpacing: "0.02em",
        }}>
          비밀번호 입력
        </label>
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); setAttempted(false); }}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          style={{
            width: "100%", padding: "14px 16px",
            border: `3px solid ${attempted && !password ? "#e53e3e" : BORDER}`,
            borderRadius: "12px", backgroundColor: "#fff",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            color: "#2c3e6b", outline: "none", boxSizing: "border-box",
          }}
        />

        <button
          className="login-btn"
          onClick={handleLogin}
          style={{
            marginTop: "28px", width: "100%", padding: "14px",
            borderRadius: "50px", border: `3px solid ${BORDER}`,
            background: "#fff", color: "#000",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer", transition: "background 0.15s, transform 0.1s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          로그인
        </button>

        {error && (
          <p style={{
            marginTop: "14px", textAlign: "center",
            color: "#e53e3e", fontSize: "13px",
            fontFamily: FONT, lineHeight: "1.5",
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}