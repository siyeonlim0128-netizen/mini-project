import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#b8ccf5";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";

// 더미 게시글 데이터
const DUMMY_POSTS = {
  1: { name: "캠핑 텐트", price: "150,000원", category: "아웃도어", type: "sale", description: "4인용 캠핑 텐트입니다. 방수 기능이 있으며 설치가 간편합니다. 2회 사용했으며 상태 매우 좋습니다.", rating: 4, photos: 3 },
  2: { name: "블루투스 스피커", price: "45,000원", category: "전자기기", type: "rent", rentPeriod: "1주일", description: "JBL 블루투스 스피커입니다. 방수 기능 있으며 음질 좋습니다. 충전기 포함.", rating: 5, photos: 2 },
  3: { name: "자전거 헬멧", price: "30,000원", category: "스포츠", type: "sale", description: "사이즈 M 자전거 헬멧입니다. 통풍 잘 되고 가볍습니다. 스크래치 없음.", rating: 3, photos: 4 },
  4: { name: "미니 선풍기", price: "12,000원", category: "가전", type: "rent", rentPeriod: "3일", description: "USB 충전식 미니 선풍기입니다. 3단계 풍속 조절 가능. 배터리 지속시간 8시간.", rating: 4, photos: 2 },
  5: { name: "등산 스틱", price: "25,000원", category: "아웃도어", type: "sale", description: "알루미늄 경량 등산 스틱 2개 세트입니다. 접이식으로 휴대 편리합니다.", rating: 5, photos: 3 },
};

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = DUMMY_POSTS[id] || DUMMY_POSTS[1];

  const [liked, setLiked] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [rating, setRating] = useState(post.rating);
  const [hoverRating, setHoverRating] = useState(0);

  const isRent = post.type === "rent";

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
      paddingBottom: "24px",
    }}>
      {/* 상단 바 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px 8px",
      }}>
        {/* 이전 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none", border: "2px solid #000",
            borderRadius: "50%", width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "16px", color: "#000",
          }}
        >
          ←
        </button>
        {/* 신고하기 */}
        <button style={{
          background: "#e53e3e", border: "none", borderRadius: "20px",
          padding: "6px 14px", color: "#fff",
          fontFamily: FONT, fontSize: "12px", fontWeight: "700",
          cursor: "pointer",
        }}>
          신고하기
        </button>
      </div>

      {/* 사진 슬라이더 */}
      <div style={{ padding: "0 16px", marginBottom: "8px" }}>
        <div style={{
          background: "#fff", border: `1.5px solid ${BORDER}`,
          borderRadius: "16px", height: "220px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px", position: "relative", overflow: "hidden",
        }}>
          {/* 이전 화살표 */}
          <button
            onClick={() => setCurrentPhoto((p) => Math.max(0, p - 1))}
            style={{
              background: "none", border: "none", fontSize: "22px",
              color: currentPhoto === 0 ? "#c5d8f8" : BLUE, cursor: "pointer", zIndex: 1,
            }}
          >
            ‹
          </button>
          {/* 사진 영역 */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", color: "#aac0e8", fontWeight: "700",
          }}>
            사진 {currentPhoto + 1} / {post.photos}
          </div>
          {/* 다음 화살표 */}
          <button
            onClick={() => setCurrentPhoto((p) => Math.min(post.photos - 1, p + 1))}
            style={{
              background: "none", border: "none", fontSize: "22px",
              color: currentPhoto === post.photos - 1 ? "#c5d8f8" : BLUE, cursor: "pointer", zIndex: 1,
            }}
          >
            ›
          </button>

          {/* 점 인디케이터 */}
          <div style={{
            position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: "6px",
          }}>
            {Array.from({ length: post.photos }).map((_, i) => (
              <div key={i} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: i === currentPhoto ? BLUE : "#c5d8f8",
              }} />
            ))}
          </div>
        </div>

        {/* 별점 */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", gap: "4px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "20px", padding: 0,
                color: star <= (hoverRating || rating) ? "#f6ad55" : "#c5d8f8",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 상품명 + 하트 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "4px 20px 12px",
      }}>
        <span style={{ fontSize: "18px", fontWeight: "700", color: "#111" }}>{post.name}</span>
        <button
          onClick={() => setLiked((l) => !l)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "24px", transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 태그들 */}
      <div style={{ padding: "0 20px", display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {/* 가격 태그 */}
        <span style={{
          border: `1.5px solid ${BORDER}`, borderRadius: "20px",
          padding: "5px 14px", fontSize: "13px", fontWeight: "700",
          color: BLUE, background: "#fff",
        }}>
          {post.price}
        </span>

        {/* 필요기간 태그 (대여일 때만) */}
        {isRent && (
          <span style={{
            border: `2px solid ${LIGHT_BLUE}`, borderRadius: "20px",
            padding: "5px 14px", fontSize: "13px", fontWeight: "700",
            color: LIGHT_BLUE, background: "#fff",
          }}>
            필요기간: {post.rentPeriod}
          </span>
        )}

        {/* 카테고리 태그 */}
        <span style={{
          border: `1.5px solid ${BORDER}`, borderRadius: "20px",
          padding: "5px 14px", fontSize: "13px", fontWeight: "700",
          color: BLUE, background: "#fff",
        }}>
          {post.category}
        </span>
      </div>

      {/* 상품 설명 */}
      <div style={{ padding: "0 20px", marginBottom: "24px" }}>
        <div style={{
          background: "#fff", border: `1.5px solid ${BORDER}`,
          borderRadius: "12px", padding: "16px",
          fontSize: "13px", color: "#444", lineHeight: "1.7",
          fontFamily: FONT, minHeight: "100px",
        }}>
          {post.description}
        </div>
      </div>

      {/* 구매하기 / 대여하기 버튼 */}
      <div style={{ padding: "0 20px" }}>
        <button style={{
          width: "100%", padding: "14px",
          borderRadius: "50px", border: `2px solid ${LIGHT_BLUE}`,
          background: "#fff", color: BLUE,
          fontSize: "17px", fontFamily: FONT, fontWeight: "700",
          cursor: "pointer", transition: "background 0.15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          {isRent ? "대여하기" : "구매하기"}
        </button>
      </div>
    </div>
  );
}