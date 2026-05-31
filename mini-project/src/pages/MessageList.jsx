import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";
const BASE_URL = "https://boo-be-production.up.railway.app";

export default function MessageList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}/api/chat-rooms`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setChats(data.data);
        } else {
          setError("채팅 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // 현재 로그인한 유저 ID (토큰 디코딩 또는 마이페이지 API로 가져와야 하지만 일단 localStorage 활용)
  const myId = Number(localStorage.getItem("userId"));

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      padding: "20px 20px 32px", position: "relative",
    }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <button onClick={() => navigate("/main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={BackArrow} alt="이전" style={{ width: "38px", height: "38px" }} />
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: BLUE, letterSpacing: "0.05em", margin: 0 }}>
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
        {loading ? (
          <div style={{ textAlign: "center", color: LIGHT_BLUE, fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#e53e3e", fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            {error}
          </div>
        ) : chats.length === 0 ? (
          <div style={{ textAlign: "center", color: LIGHT_BLUE, fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            채팅 내역이 없습니다.
          </div>
        ) : (
          chats.map((chat) => {
            // 내가 구매자면 판매자 닉네임, 내가 판매자면 구매자 닉네임 표시
            const opponentNickname = myId === chat.buyerId ? chat.sellerNickname : chat.buyerNickname;

            return (
              <button
                key={chat.roomId}
                onClick={() => navigate(`/message/${chat.roomId}`)}
                style={{
                  width: "100%", padding: "18px",
                  border: `3px solid ${BORDER}`, borderRadius: "50px",
                  background: "#fff", textAlign: "left",
                  fontSize: "14px", fontWeight: "700", color: "#000",
                  fontFamily: FONT, cursor: "pointer",
                  transition: "background 0.15s",
                  display: "flex", alignItems: "center", gap: "12px",
                  position: "relative",
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

                {/* 닉네임 + 게시글 제목 */}
                <div style={{ flex: 1 }}>
                  <div>{opponentNickname}</div>
                  <div style={{ fontSize: "11px", color: LIGHT_BLUE, marginTop: "2px", fontWeight: "600" }}>
                    {chat.postTitle}
                  </div>
                </div>

                {/* 읽지 않은 메시지 수 */}
                {chat.unreadCount > 0 && (
                  <div style={{
                    background: "#e53e3e", color: "#fff",
                    borderRadius: "50%", width: "20px", height: "20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", flexShrink: 0,
                  }}>
                    {chat.unreadCount}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}