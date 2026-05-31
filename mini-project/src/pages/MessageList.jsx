import React from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";

const DUMMY_CHATS = [
  { id: 1, nickname: "임시연" },
  { id: 2, nickname: "성재우" },
  { id: 3, nickname: "김재웅" },
  { id: 4, nickname: "고선민" },
  { id: 5, nickname: "이현철" },
  { id: 6, nickname: "강나연" },
  { id: 7, nickname: "김시은" },
  { id: 8, nickname: "이승훈" },
];

export default function MessageList() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      padding: "20px 20px 32px", position: "relative",
    }}>
      {/* 상단 바 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "24px",
      }}>
        <button
          onClick={() => navigate("/main")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img src={BackArrow} alt="이전" style={{ width: "38px", height: "38px" }} />
        </button>
        <h1 style={{
          fontSize: "20px", fontWeight: "700", color: BLUE,
          letterSpacing: "0.05em", margin: 0,
        }}>
          메시지
        </h1>
        <div style={{ width: "38px" }} />
      </div>

      {/* 채팅 목록 */}
      <div style={{
        background: "#fff", border: `3px solid ${BORDER}`,
        borderRadius: "20px", padding: "16px 12px",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {DUMMY_CHATS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => navigate(`/message/${chat.id}`)}
            style={{
              width: "100%", padding: "18px 18px",
              border: `3px solid ${BORDER}`, borderRadius: "50px",
              background: "#fff", textAlign: "left",
              fontSize: "14px", fontWeight: "700", color: "#000",
              fontFamily: FONT, cursor: "pointer",
              transition: "background 0.15s",
              display: "flex", alignItems: "center", gap: "12px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            {/* 아바타 */}
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: BG, border: `2px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", flexShrink: 0,
            }}>
              🦉
            </div>
            {chat.nickname}
          </button>
        ))}
      </div>
    </div>
  );
}