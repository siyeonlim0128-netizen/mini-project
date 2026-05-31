import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Boo2 from "../assets/Boo2.svg";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BLUE = "#3a5fa8";
const BORDER = "#b8ccf5";
const MY_BUBBLE = "#b8ccf5";
const OTHER_BUBBLE = "#fff";
const BASE_URL = "https://boo-be-production.up.railway.app";

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams(); // roomId
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const stompClient = useRef(null);
  const myId = Number(localStorage.getItem("userId"));

  // 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}/api/chat-rooms/${id}/messages`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("메시지 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  // 웹소켓 연결
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws/chat`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        // 채팅방 구독
        client.subscribe(`/topic/chat/${id}`, (message) => {
          const received = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 오류:", frame);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [id]);

  // 새 메시지 오면 스크롤 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: `/app/chat/${id}`,
      body: JSON.stringify({ message: input.trim() }),
    });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // 상대방 닉네임 (메시지 목록에서 추출)
  const opponentNickname = messages.find((m) => m.senderId !== myId)?.senderNickname || "상대방";

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
        <button onClick={() => navigate("/messages")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={BackArrow} alt="이전" style={{ width: "36px", height: "36px" }} />
        </button>
        <span style={{ fontSize: "16px", fontWeight: "700", color: BLUE }}>
          {loading ? "..." : opponentNickname}
        </span>
        <img src={Boo2} alt="부엉이" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
      </div>

      {/* 메시지 목록 */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: BLUE, fontSize: "13px", fontWeight: "700", marginTop: "40px" }}>
            불러오는 중...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aac0e8", fontSize: "13px", fontWeight: "700", marginTop: "40px" }}>
            첫 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === myId;
            return (
              <div key={msg.messageId || msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "65%", padding: "10px 14px",
                  borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isMine ? MY_BUBBLE : OTHER_BUBBLE,
                  border: isMine ? "none" : `1.5px solid ${BORDER}`,
                  fontSize: "13px", fontWeight: "700", color: "#333",
                  lineHeight: "1.5",
                }}>
                  {msg.message || msg.text}
                </div>
              </div>
            );
          })
        )}
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