import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Boo2 from "../assets/Boo2.svg";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BLUE = "#3a5fa8";
const BORDER = "#b8ccf5";
const MY_BUBBLE = "#b8ccf5";
const OTHER_BUBBLE = "#fff";

const DUMMY_CHATS = {
  1: { nickname: "햄스터", messages: [
    { id: 1, mine: false, text: "안녕하세요!" },
    { id: 2, mine: true, text: "네 안녕하세요!" },
    { id: 3, mine: false, text: "혹시 아직 판매 중인가요?" },
    { id: 4, mine: true, text: "네 판매 중입니다!" },
  ]},
  2: { nickname: "사과", messages: [
    { id: 1, mine: false, text: "가격 조정 가능한가요?" },
    { id: 2, mine: true, text: "조금은 가능해요!" },
  ]},
  3: { nickname: "복숭아", messages: [] },
  4: { nickname: "포도", messages: [] },
  5: { nickname: "딸기딸기", messages: [] },
};

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chat = DUMMY_CHATS[id] || DUMMY_CHATS[1];

  const [messages, setMessages] = useState(chat.messages);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), mine: true, text: input.trim() }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      height: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
    }}>
      {/* 상단 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px 12px",
        borderBottom: `1.5px solid ${BORDER}`,
        background: BG,
      }}>
        <button
            onClick={() => navigate("/messages")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
            <img src={BackArrow} alt="이전" style={{ width: "36px", height: "36px" }} />
        </button>

        <span style={{ fontSize: "16px", fontWeight: "700", color: BLUE }}>
          {chat.nickname}
        </span>
        <img src={Boo2} alt="부엉이" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
      </div>

      {/* 메시지 목록 */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.mine ? "flex-end" : "flex-start",
            }}
          >
            <div style={{
              maxWidth: "65%", padding: "10px 14px",
              borderRadius: msg.mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.mine ? MY_BUBBLE : OTHER_BUBBLE,
              border: msg.mine ? "none" : `1.5px solid ${BORDER}`,
              fontSize: "13px", fontWeight: "700", color: "#333",
              lineHeight: "1.5",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div style={{
        padding: "12px 16px",
        borderTop: `1.5px solid ${BORDER}`,
        background: BG, display: "flex", gap: "8px", alignItems: "center",
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1, padding: "12px 16px",
            border: `1.5px solid ${BORDER}`, borderRadius: "50px",
            fontSize: "13px", fontFamily: FONT, outline: "none",
            background: "#fff", color: "#333",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 18px", borderRadius: "50px",
            border: "none", background: BLUE, color: "#fff",
            fontFamily: FONT, fontSize: "13px", fontWeight: "700",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}