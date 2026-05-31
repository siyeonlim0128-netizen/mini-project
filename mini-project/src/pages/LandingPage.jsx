import React from "react";
import { useNavigate } from "react-router-dom";
import Boo1 from "../assets/Boo1.svg";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";

const injectStyles = () => {
  if (document.getElementById("landing-styles")) return;
  const style = document.createElement("style");
  style.id = "landing-styles";
  style.textContent = `
    @keyframes owlFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .owl-float {
      animation: owlFloat 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
};

export default function LandingPage() {
  const navigate = useNavigate();
  injectStyles();

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 32px",
    }}>
      {/* Welcome 텍스트 */}
      <p style={{
        fontSize: "20px", color: "#7D7D7D", fontWeight: "700",
        marginBottom: "1px", letterSpacing: "0.03em",
      }}>
        Welcome to
      </p>

      {/* 타이틀 */}
      <h1 style={{
        fontSize: "26px", fontWeight: "700", color: BLUE,
        marginBottom: "24px", letterSpacing: "0.05em",
      }}>
        BOO-Market
      </h1>

      {/* 부엉이 */}
      <img
        src={Boo1}
        alt="BOO 마스코트"
        className="owl-float"
        style={{
          width: "180px", height: "180px",
          objectFit: "contain", marginBottom: "24px",
        }}
      />

      {/* 버튼 영역 */}
      <div style={{
        width: "100%", display: "flex", flexDirection: "column", gap: "14px",
      }}>
        {/* 로그인 */}
        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "50px", border: `3px solid ${BORDER}`,
            background: "#fff", color: "#000",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer", transition: "background 0.15s",
            textAlign: "center", justifyContent: "center",
            display: "flex", alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          로그인
        </button>

        {/* 회원가입 */}
        <button
          onClick={() => navigate("/signup")}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "50px", border: `3px solid ${BORDER}`,
            background: "#fff", color: "#000",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer", transition: "background 0.15s",
            textAlign: "center", justifyContent: "center",
            display: "flex", alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          회원가입
        </button>

        {/* 비번 재설정 */}
        <button
          onClick={() => navigate("/password-reset")}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "50px", border: `3px solid ${BORDER}`,
            background: "#fff", color: "#000",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer", transition: "background 0.15s",
            textAlign: "center", justifyContent: "center",
            display: "flex", alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          비번 재설정
        </button>
      </div>
    </div>
  );
}