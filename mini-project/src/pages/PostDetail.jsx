import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";
const BASE_URL = "https://boo-be-production.up.railway.app";

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // 게시글 상세 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (response.ok) {
          setPost(data.data);
          setLiked(data.data.isWished);
          setRating(data.data.itemCondition || 0);
        } else {
          setError("게시글을 불러오지 못했습니다.");
        }
      } catch (err) {
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 찜 추가/해제
  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(`${BASE_URL}/api/wishes/${id}`, {
        method,
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) setLiked((l) => !l);
    } catch (err) {
      console.error("찜 처리 실패:", err);
    }
  };

  // 채팅방 생성 후 이동
  const handleBuy = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/chat-rooms/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/message/${data.data.roomId}`);
      }
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
    }
  };

  const isRent = post?.category === "대여";
  const images = post?.images || [];

  if (loading) return (
    <div style={{ width: "100%", maxWidth: "390px", margin: "0 auto", minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: "14px", color: BLUE, fontWeight: "700" }}>
      불러오는 중...
    </div>
  );

  if (error) return (
    <div style={{ width: "100%", maxWidth: "390px", margin: "0 auto", minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: "14px", color: "#e53e3e", fontWeight: "700" }}>
      {error}
    </div>
  );

  return (
    <div style={{
      width: "100%", maxWidth: "390px", margin: "0 auto",
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: FONT, display: "flex", flexDirection: "column",
    }}>

      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={BackArrow} alt="이전" style={{ width: "38px", height: "38px" }} />
        </button>
        <button
          onClick={() => navigate("/report", { state: { targetUserId: post?.authorId, postId: id } })}
          style={{
            background: "#e53e3e", border: "none", borderRadius: "50px",
            padding: "7px 18px", color: "#fff",
            fontFamily: FONT, fontSize: "12px", fontWeight: "700", cursor: "pointer",
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
            style={{ background: "none", border: "none", fontSize: "28px", color: currentPhoto === 0 ? "#c5d8f8" : BLUE, cursor: "pointer" }}
          >‹</button>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            {images.length > 0 ? (
              <img src={images[currentPhoto]} alt="상품" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px" }} />
            ) : (
              <>
                <div style={{ fontSize: "40px" }}>📷</div>
                <span style={{ fontSize: "13px", color: "#aac0e8", fontWeight: "700" }}>사진 없음</span>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentPhoto((p) => Math.min(images.length - 1, p + 1))}
            style={{ background: "none", border: "none", fontSize: "28px", color: currentPhoto === images.length - 1 ? "#c5d8f8" : BLUE, cursor: "pointer" }}
          >›</button>

          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
              {images.map((_, i) => (
                <div key={i} style={{
                  width: i === currentPhoto ? "18px" : "7px", height: "7px", borderRadius: "50px",
                  background: i === currentPhoto ? BLUE : "#c5d8f8", transition: "width 0.2s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* 별점 (상품 상태) */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "none", border: "none", cursor: "default",
                fontSize: "22px", padding: 0,
                color: star <= (hoverRating || rating) ? "#f6ad55" : "#dde8f8",
              }}
            >★</button>
          ))}
        </div>
      </div>

      {/* 상품 정보 카드 */}
      <div style={{ margin: "0 20px 16px", background: "#fff", border: `3px solid ${BORDER}`, borderRadius: "20px", padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: BLUE }}>{post?.title}</span>
          <button onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "26px", padding: 0 }}>
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ border: `2px solid ${BORDER}`, borderRadius: "50px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", color: BLUE, background: BG }}>
            {post?.isFree ? "무료나눔" : `${post?.price?.toLocaleString()}원`}
          </span>
          {isRent && post?.startDate && (
            <span style={{ border: `2px solid ${LIGHT_BLUE}`, borderRadius: "50px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", color: LIGHT_BLUE, background: "#eef4ff" }}>
              {post.startDate} ~ {post.endDate}
            </span>
          )}
          <span style={{ border: `2px solid ${BORDER}`, borderRadius: "50px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", color: BLUE, background: BG }}>
            {post?.category}
          </span>
          {post?.tradeLocation && (
            <span style={{ border: `2px solid ${BORDER}`, borderRadius: "50px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", color: BLUE, background: BG }}>
              📍 {post.tradeLocation}
            </span>
          )}
        </div>
      </div>

      {/* 상품 설명 카드 */}
      <div style={{ margin: "0 20px 24px", background: "#fff", border: `3px solid ${BORDER}`, borderRadius: "20px", padding: "18px 20px" }}>
        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.8", fontFamily: FONT, margin: 0, fontWeight: "700" }}>
          {post?.description}
        </p>
      </div>

      {/* 구매/대여 버튼 */}
      <div style={{ padding: "0 20px", marginTop: "auto", paddingBottom: "32px" }}>
        <button
          onClick={handleBuy}
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