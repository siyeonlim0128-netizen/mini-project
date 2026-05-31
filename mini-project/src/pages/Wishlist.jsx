import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";

const DUMMY_WISHLIST = [
  { id: 1, name: "캠핑 텐트", price: "150,000원", category: "아웃도어" },
  { id: 2, name: "블루투스 스피커", price: "45,000원", category: "전자기기" },
  { id: 3, name: "자전거 헬멧", price: "30,000원", category: "스포츠" },
  { id: 4, name: "미니 선풍기", price: "12,000원", category: "가전" },
  { id: 5, name: "등산 스틱", price: "25,000원", category: "아웃도어" },
  { id: 6, name: "등산 스틱", price: "25,000원", category: "아웃도어" },
  { id: 7, name: "등산 스틱", price: "25,000원", category: "아웃도어" },
  { id: 8, name: "등산 스틱", price: "25,000원", category: "아웃도어" },
  { id: 9, name: "등산 스틱", price: "25,000원", category: "아웃도어" },
];

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(DUMMY_WISHLIST);

  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
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
        gap: "12px",
        minHeight: "500px",
        maxHeight: "70vh",
        overflowY: "auto",
      }}>
        {wishlist.length === 0 ? (
          <div style={{
            textAlign: "center", color: LIGHT_BLUE,
            fontSize: "14px", padding: "40px 0", fontWeight: "700",
          }}>
            관심 상품이 없습니다.
          </div>
        ) : (
          wishlist.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#fff", border: `3px solid ${BORDER}`,
                borderRadius: "12px", padding: "14px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/post/${product.id}`)}
            >
              {/* 사진 placeholder */}
              <div style={{
                width: "64px", height: "64px", borderRadius: "10px",
                background: "#c5d8f8", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#6b8fd4", fontFamily: FONT,
              }}>
                사진
              </div>

              {/* 상품 정보 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: BLUE }}>{product.name}</div>
                <div style={{ fontSize: "12px", color: "#6b8fd4", marginTop: "4px" }}>{product.price}</div>
                <div style={{ fontSize: "11px", color: LIGHT_BLUE, marginTop: "2px" }}>{product.category}</div>
              </div>

              {/* 하트 버튼 */}
              <button
                onClick={(e) => { e.stopPropagation(); removeItem(product.id); }}
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