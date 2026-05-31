import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";

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
    }}>

      {/* 상단 바 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 20px 12px",
      }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={BackArrow} alt="이전" style={{ width: "38px", height: "38px" }} />
        </button>
        <button
          onClick={() => navigate("/report")}
          style={{
            background: "#e53e3e", border: "none", borderRadius: "50px",
            padding: "7px 18px", color: "#fff",
            fontFamily: FONT, fontSize: "12px", fontWeight: "700",
            cursor: "pointer", letterSpacing: "0.03em",
          }}
        >
          신고하기
        </button>
      </div>

      {/* 사진 슬라이더 */}
      <div style={{ padding: "0 20px", marginBottom: "16px" }}>
        <div style={{
          background: "#fff", border: `3px solid ${BORDER}`,
          borderRadius: "20px", height: "230px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 14px", position: "relative", overflow: "hidden",
        }}>
          <button
            onClick={() => setCurrentPhoto((p) => Math.max(0, p - 1))}
            style={{
              background: "none", border: "none", fontSize: "28px",
              color: currentPhoto === 0 ? "#c5d8f8" : BLUE, cursor: "pointer",
            }}
          >‹</button>

          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "12px",
          }}>
            <div style={{ fontSize: "40px" }}>📷</div>
            <span style={{ fontSize: "13px", color: "#aac0e8", fontWeight: "700" }}>
              {currentPhoto + 1} / {post.photos}
            </span>
          </div>

          <button
            onClick={() => setCurrentPhoto((p) => Math.min(post.photos - 1, p + 1))}
            style={{
              background: "none", border: "none", fontSize: "28px",
              color: currentPhoto === post.photos - 1 ? "#c5d8f8" : BLUE, cursor: "pointer",
            }}
          >›</button>

          {/* 점 인디케이터 */}
          <div style={{
            position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: "6px",
          }}>
            {Array.from({ length: post.photos }).map((_, i) => (
              <div key={i} style={{
                width: i === currentPhoto ? "18px" : "7px",
                height: "7px", borderRadius: "50px",
                background: i === currentPhoto ? BLUE : "#c5d8f8",
                transition: "width 0.2s",
              }} />
            ))}
          </div>
        </div>

        {/* 별점 */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "22px", padding: 0,
                color: star <= (hoverRating || rating) ? "#f6ad55" : "#dde8f8",
                transition: "color 0.15s, transform 0.1s",
              }}
            >★</button>
          ))}
        </div>
      </div>

      {/* 상품 정보 카드 */}
      <div style={{
        margin: "0 20px 16px",
        background: "#fff", border: `3px solid ${BORDER}`,
        borderRadius: "20px", padding: "18px 20px",
      }}>
        {/* 상품명 + 하트 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: BLUE }}>{post.name}</span>
          <button
            onClick={() => setLiked((l) => !l)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "26px", padding: 0 }}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        {/* 태그들 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span style={{
            border: `2px solid ${BORDER}`, borderRadius: "50px",
            padding: "4px 14px", fontSize: "12px", fontWeight: "700",
            color: BLUE, background: BG,
          }}>
            {post.price}
          </span>
          {isRent && (
            <span style={{
              border: `2px solid ${LIGHT_BLUE}`, borderRadius: "50px",
              padding: "4px 14px", fontSize: "12px", fontWeight: "700",
              color: LIGHT_BLUE, background: "#eef4ff",
            }}>
              필요기간: {post.rentPeriod}
            </span>
          )}
          <span style={{
            border: `2px solid ${BORDER}`, borderRadius: "50px",
            padding: "4px 14px", fontSize: "12px", fontWeight: "700",
            color: BLUE, background: BG,
          }}>
            {post.category}
          </span>
        </div>
      </div>

      {/* 상품 설명 카드 */}
      <div style={{
        margin: "0 20px 24px",
        background: "#fff", border: `3px solid ${BORDER}`,
        borderRadius: "20px", padding: "18px 20px",
      }}>
        <p style={{
          fontSize: "13px", color: "#555", lineHeight: "1.8",
          fontFamily: FONT, margin: 0, fontWeight: "700",
        }}>
          {post.description}
        </p>
      </div>

      {/* 구매/대여 버튼 */}
      <div style={{ padding: "0 20px", marginTop: "auto", paddingBottom: "32px" }}>
        <button
          onClick={() => navigate(`/message/${id}`)}
          style={{
            width: "100%", padding: "15px",
            borderRadius: "50px", border: `3px solid ${BORDER}`,
            background: "#fff", color: "#000",
            fontSize: "15px", fontFamily: FONT, fontWeight: "700",
            cursor: "pointer", transition: "background 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
            letterSpacing: "0.05em",
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