import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const RED = "#e53e3e";
const BROWN = "#9e8b7b";
const BASE_URL = "https://boo-be-production.up.railway.app";

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetUserId, postId } = location.state || {};

  const [reason, setReason] = useState("");
  const [step, setStep] = useState("form");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    setStep("confirm");
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_user_id: targetUserId,
          post_id: postId ? Number(postId) : undefined,
          reason,
        }),
      });

      if (response.ok) {
        setStep("done");
        setTimeout(() => navigate(-1), 3000);
      } else {
        setStep("form");
        alert("신고 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setStep("form");
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      padding: "20px 20px 32px",
    }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={BackArrow} alt="이전" style={{ width: "38px", height: "38px" }} />
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: BLUE, margin: 0 }}>신고하기</h1>
        <div style={{ width: "38px" }} />
      </div>

      {/* 카드 */}
      <div style={{
        background: "#fff", border: `3px solid ${BORDER}`,
        borderRadius: "20px", padding: "24px 20px",
        position: "relative", flex: 1,
        display: "flex", flexDirection: "column",
      }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: BLUE, marginBottom: "16px", lineHeight: "1.7" }}>
          사용자를 신고하는 사유를<br />작성해주세요.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="신고 내용을 작성해주세요."
          rows={6}
          style={{
            width: "100%", padding: "14px 16px",
            border: `3px solid ${BORDER}`, borderRadius: "16px",
            fontSize: "13px", fontFamily: FONT, outline: "none",
            boxSizing: "border-box", resize: "none",
            color: "#333", lineHeight: "1.7", fontWeight: "700",
          }}
        />

        {/* 확인 오버레이 */}
        {step === "confirm" && (
          <div style={{
            position: "absolute", inset: "120px 10px 100px 10px",
            background: BROWN, borderRadius: "16px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "20px",
          }}>
            <p style={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}>
              정말로 신고하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("form")}
                style={{ padding: "10px 24px", borderRadius: "50px", border: "none", background: "#fff", color: "#333", fontFamily: FONT, fontWeight: "700", fontSize: "14px", cursor: "pointer" }}
              >아니요</button>
              <button
                onClick={handleConfirm}
                style={{ padding: "10px 24px", borderRadius: "50px", border: "none", background: "#fff", color: RED, fontFamily: FONT, fontWeight: "700", fontSize: "14px", cursor: "pointer" }}
              >네</button>
            </div>
          </div>
        )}

        {/* 완료 오버레이 */}
        {step === "done" && (
          <div style={{
            position: "absolute", inset: "120px 10px 100px 10px",
            background: BROWN, borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <p style={{ color: "#fff", fontSize: "16px", fontWeight: "700", textAlign: "center", lineHeight: "1.8" }}>
              신고가<br />완료되었습니다.
            </p>
          </div>
        )}

        {/* 신고하기 버튼 */}
        <button
          onClick={step === "form" ? handleSubmit : undefined}
          style={{
            marginTop: "20px", width: "100%", padding: "14px",
            borderRadius: "50px", border: `3px solid ${RED}`,
            background: RED, color: "#fff",
            fontSize: "14px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            letterSpacing: "0.05em",
            pointerEvents: step !== "form" ? "none" : "auto",
            opacity: step !== "form" ? 0 : 1,
          }}
        >
          신고하기
        </button>
      </div>
    </div>
  );
}