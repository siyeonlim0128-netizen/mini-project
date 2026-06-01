import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Boo2 from "../assets/Boo2.svg";
import BackArrow from "../assets/arrow-left-circle.svg";
import { API_BASE_URL, getAccessToken, getCurrentUser, isCurrentUserValue } from "../api";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BLUE = "#3a5fa8";
const BORDER = "#b8ccf5";
const MY_BUBBLE = "#b8ccf5";
const OTHER_BUBBLE = "#fff";

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value) !== "");

const getSenderValue = (message) =>
  firstValue(
    message?.senderId,
    message?.sender_id,
    message?.sender?.id,
    message?.sender?.email,
    message?.userId,
    message?.user_id,
    message?.user?.id,
    message?.user?.email,
    message?.memberId,
    message?.member_id,
    message?.member?.id,
    message?.member?.email,
    message?.writerId,
    message?.writer_id,
    message?.writer?.id,
    message?.writer?.email,
    message?.senderEmail,
    message?.sender_email,
    message?.email
  );

const getSenderNickname = (message) =>
  firstValue(
    message?.senderNickname,
    message?.sender_nickname,
    message?.sender?.nickname,
    message?.sender?.name,
    message?.nickname,
    message?.senderName,
    message?.sender_name,
    message?.user?.nickname,
    message?.member?.nickname,
    message?.writer?.nickname
  );

const getMessageText = (message) =>
  firstValue(message?.message, message?.text, message?.content, message?.body) || "";

const normalizeMessage = (message) => ({
  ...message,
  isRead: Boolean(firstValue(message?.isRead, message?.read, false)),
});

const extractMessages = (responseData) => {
  const data = responseData?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.chatMessages)) return data.chatMessages;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(responseData?.messages)) return responseData.messages;
  return [];
};

const getMessageKey = (message, index) =>
  firstValue(
    message?.clientMessageId,
    message?.messageId,
    message?.message_id,
    message?.id,
    `${message?.createdAt || message?.sentAt || "message"}-${index}`
  );

const isCurrentUserNickname = (nickname) => {
  const currentNickname = getCurrentUser().nickname;
  return Boolean(currentNickname && nickname && String(currentNickname) === String(nickname));
};

const isMineMessage = (message) =>
  Boolean(
    message?.isMine ||
      message?.mine ||
      message?.me ||
      message?.sender === "me" ||
      isCurrentUserValue(getSenderValue(message)) ||
      isCurrentUserNickname(getSenderNickname(message))
  );

const createMyMessage = (messageText, roomId) => {
  const currentUser = getCurrentUser();
  const clientMessageId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    clientMessageId,
    roomId,
    message: messageText,
    content: messageText,
    senderId: currentUser.id,
    senderEmail: currentUser.email,
    senderNickname: currentUser.nickname,
    isMine: true,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
};

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const bottomRef = useRef(null);
  const stompClient = useRef(null);
  const pendingSentMessages = useRef([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`${API_BASE_URL}/api/chat-rooms/${id}/messages`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(extractMessages(data).map(normalizeMessage));
        }
      } catch (err) {
        console.error("메시지 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    const token = getAccessToken();

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws/chat`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        setConnectionError("");

        client.subscribe(`/topic/chat/${id}`, (message) => {
          let received;
          try {
            received = normalizeMessage(JSON.parse(message.body));
          } catch {
            return;
          }

          const receivedText = getMessageText(received);
          const pendingIndex = pendingSentMessages.current.findIndex(
            (pending) =>
              pending.clientMessageId === received.clientMessageId ||
              pending.message === receivedText
          );

          if (pendingIndex >= 0) {
            received = {
              ...received,
              isMine: true,
              clientMessageId: pendingSentMessages.current[pendingIndex].clientMessageId,
            };
            pendingSentMessages.current.splice(pendingIndex, 1);
          }

          setMessages((prev) => {
            const replaceIndex = prev.findIndex(
              (item) =>
                item.clientMessageId &&
                item.clientMessageId === received.clientMessageId
            );

            if (replaceIndex >= 0) {
              const next = [...prev];
              next[replaceIndex] = { ...prev[replaceIndex], ...received, isMine: true };
              return next;
            }

            return [...prev, received];
          });
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        setConnected(false);
        setConnectionError("채팅 서버 연결을 확인해 주세요.");
        console.error("STOMP 오류:", frame);
      },
      onWebSocketError: (event) => {
        setConnected(false);
        setConnectionError("채팅 서버 연결을 확인해 주세요.");
        console.error("WebSocket 오류:", event);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      setConnected(false);
      client.deactivate();
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const messageText = input.trim();
    if (!messageText) return;

    if (!stompClient.current?.connected) {
      setConnectionError("채팅 서버에 연결 중입니다. 잠시 후 다시 보내주세요.");
      return;
    }

    const myMessage = createMyMessage(messageText, id);
    pendingSentMessages.current.push(myMessage);
    setMessages((prev) => [...prev, myMessage]);
    setInput("");

    stompClient.current.publish({
      destination: `/app/chat/${id}`,
      body: JSON.stringify({
        roomId: id,
        message: messageText,
        content: messageText,
        clientMessageId: myMessage.clientMessageId,
        isRead: false,
      }),
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  const opponentNickname =
    getSenderNickname(messages.find((message) => !isMineMessage(message))) || "상대방";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "390px",
        margin: "0 auto",
        height: "100vh",
        backgroundColor: BG,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: `1.5px solid ${BORDER}`,
          background: BG,
        }}
      >
        <button
          onClick={() => navigate("/messages")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img src={BackArrow} alt="이전" style={{ width: "36px", height: "36px" }} />
        </button>
        <span style={{ fontSize: "16px", fontWeight: "700", color: BLUE }}>
          {loading ? "..." : opponentNickname}
        </span>
        <img src={Boo2} alt="부엉이" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {connectionError && (
          <div style={{ textAlign: "center", color: "#d94d4d", fontSize: "12px", fontWeight: "700" }}>
            {connectionError}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", color: BLUE, fontSize: "13px", fontWeight: "700", marginTop: "40px" }}>
            불러오는 중...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aac0e8", fontSize: "13px", fontWeight: "700", marginTop: "40px" }}>
            첫 메시지를 보내보세요.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = isMineMessage(msg);

            return (
              <div
                key={getMessageKey(msg, index)}
                style={{
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isMine ? MY_BUBBLE : OTHER_BUBBLE,
                    border: isMine ? "none" : `1.5px solid ${BORDER}`,
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#333",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                >
                  {getMessageText(msg)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: `1.5px solid ${BORDER}`,
          background: BG,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? "메시지를 입력하세요" : "채팅 서버 연결 중..."}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: `1.5px solid ${BORDER}`,
            borderRadius: "50px",
            fontSize: "13px",
            fontFamily: FONT,
            outline: "none",
            background: "#fff",
            color: "#333",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 18px",
            borderRadius: "50px",
            border: "none",
            background: connected ? BLUE : "#8ea2d8",
            color: "#fff",
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: "700",
            cursor: connected ? "pointer" : "default",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}
