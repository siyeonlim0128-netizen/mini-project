import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";
const BASE_URL = "https://boo-be-production.up.railway.app";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 찜 목록 불러오기
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}/api/wish_lists`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setWishlist(data.data);
        } else {
          setError("찜 목록을 불러오지 못했습니다.");
        }
      } catch (err) {
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // 찜 해제
  const removeItem = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/wishes/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        setWishlist((prev) => prev.filter((p) => p.postId !== postId));
      }
    } catch (err) {
      console.error("찜 해제 실패:", err);
    }
  };

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      alignItems: "center", padding: "32px 20px 24px",
      overflowY: "visible",
    }}>
      {/* 제목 */}
      <h1 style={{
        fontSize: "22px", fontWeight: "700", color: BLUE,
        marginBottom: "24px", letterSpacing: "0.05em",
      }}>
        관심 상품
      </h1>

      {/* 흰 박스 래퍼 */}
      <div style={{
        width: "90%", background: "#fff",
        border: `3px solid ${BORDER}`, borderRadius: "16px",
        padding: "16px", display: "flex", flexDirection: "column",
        gap: "12px", minHeight: "500px", maxHeight: "70vh", overflowY: "auto",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: LIGHT_BLUE, fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#e53e3e", fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            {error}
          </div>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: "center", color: LIGHT_BLUE, fontSize: "14px", padding: "40px 0", fontWeight: "700" }}>
            관심 상품이 없습니다.
          </div>
        ) : (
          wishlist.map((product) => (
            <div
              key={product.postId}
              style={{
                background: "#fff", border: `3px solid ${BORDER}`,
                borderRadius: "12px", padding: "14px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/post/${product.postId}`)}
            >
              {/* 썸네일 */}
              <div style={{
                width: "64px", height: "64px", borderRadius: "10px",
                background: "#c5d8f8", flexShrink: 0,
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#6b8fd4", fontFamily: FONT,
              }}>
                {product.thumbnailUrl
                  ? <img src={product.thumbnailUrl} alt="썸네일" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "사진"
                }
              </div>

              {/* 상품 정보 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: BLUE }}>{product.title}</div>
                <div style={{ fontSize: "12px", color: "#6b8fd4", marginTop: "4px" }}>
                  {product.isFree ? "무료나눔" : `${product.price?.toLocaleString()}원`}
                </div>
              </div>

              {/* 하트 버튼 */}
              <button
                onClick={(e) => { e.stopPropagation(); removeItem(product.postId); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "22px", lineHeight: 1, padding: 0,
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                ❤️
              </button>
            </div>
          ))
        )}
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={() => navigate("/main")}
        style={{
          marginTop: "32px", padding: "12px 48px",
          borderRadius: "50px", border: `3px solid ${BORDER}`,
          background: "#fff", color: "#000",
          fontSize: "14px", fontFamily: FONT, fontWeight: "700",
          cursor: "pointer", transition: "background 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        닫기
      </button>
    </div>
  );
}