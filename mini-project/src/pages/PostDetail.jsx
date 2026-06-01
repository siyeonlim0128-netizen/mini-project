import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from '../assets/arrow-left-circle.svg';
import {
  getCurrentUser,
  isCurrentUserValue,
  removeLocalWishlistItem,
  requestWish,
  saveLocalWishlistItem,
} from "../api";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";
const BASE_URL = "https://boo-be-production.up.railway.app";

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value) !== "");

const getLocalMyPosts = () => {
  try {
    return JSON.parse(localStorage.getItem("myPosts") || "[]");
  } catch {
    return [];
  }
};

const getPostId = (post) =>
  post?.postId ?? post?.goodsId ?? post?.goods_id ?? post?.post_id ?? post?.id;

const getInterestCount = (post) =>
  Number(
    firstValue(
      post?.wishCount,
      post?.wish_count,
      post?.wishlistCount,
      post?.wishlist_count,
      post?.wishListCount,
      post?.wish_list_count,
      post?.interestCount,
      post?.interest_count,
      post?.wishedCount,
      post?.wished_count,
      post?.heartCount,
      post?.heart_count,
      0
    )
  ) || 0;

const getRoomId = (responseData) => {
  const room = responseData?.data?.chatRoom || responseData?.data?.room || responseData?.data || responseData;

  return firstValue(
    room?.roomId,
    room?.room_id,
    room?.chatRoomId,
    room?.chat_room_id,
    room?.id,
    responseData?.roomId,
    responseData?.room_id
  );
};

const isCurrentUserPost = (post, routePostId) => {
  if (!post) return false;
  if (post.isMine || post.mine || post.isOwner || post.owner) return true;

  if (
    getLocalMyPosts().some(
      (item) => String(getPostId(item)) === String(routePostId || getPostId(post))
    )
  ) {
    return true;
  }

  const author = post.author || post.seller || post.user || post.member || post.writer || {};
  const ownerValue = firstValue(
    post.authorId,
    post.author_id,
    post.sellerId,
    post.seller_id,
    post.userId,
    post.user_id,
    post.memberId,
    post.member_id,
    post.writerId,
    post.writer_id,
    post.ownerId,
    post.owner_id,
    post.authorEmail,
    post.author_email,
    post.sellerEmail,
    post.seller_email,
    author.id,
    author.userId,
    author.user_id,
    author.memberId,
    author.member_id,
    author.email
  );

  if (isCurrentUserValue(ownerValue)) return true;

  const currentUser = getCurrentUser();
  const ownerNickname = firstValue(
    post.authorNickname,
    post.author_nickname,
    post.sellerNickname,
    post.seller_nickname,
    post.nickname,
    author.nickname,
    author.name
  );

  return Boolean(currentUser.nickname && ownerNickname === currentUser.nickname);
};

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [interestCount, setInterestCount] = useState(0);
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
          setLiked(Boolean(data.data.isWished || data.data.is_wished || data.data.wished));
          setInterestCount(getInterestCount(data.data));
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
    const shouldLike = !liked;
    setLiked(shouldLike);
    setInterestCount((count) => Math.max(0, count + (shouldLike ? 1 : -1)));

    if (shouldLike) {
      saveLocalWishlistItem({
        ...post,
        postId: id,
        id,
        thumbnailUrl: post?.thumbnailUrl || post?.thumbnail_url || post?.images?.[0],
      });
    } else {
      removeLocalWishlistItem(id);
    }

    try {
      await requestWish(id, shouldLike);
    } catch (err) {
      console.warn("찜 처리 백엔드 요청 실패:", err);
    }
  };

  const handlePurchase = () => {
    if (isCurrentUserPost(post, id)) return;
    alert("구매 요청은 메세지로 판매자와 이야기해 주세요.");
  };

  // 채팅방 생성 후 이동
  const handleMessage = async () => {
    if (isCurrentUserPost(post, id)) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요한 기능입니다.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/chat-rooms/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const roomId = getRoomId(data);
        navigate(roomId ? `/message/${roomId}` : "/messages");
      } else {
        navigate("/messages");
      }
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      navigate("/messages");
    }
  };

  const isRent = post?.category === "대여";
  const images = post?.images || [];
  const isOwnPost = isCurrentUserPost(post, id);

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
        {isOwnPost ? (
          <div style={{ width: "78px" }} />
        ) : (
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
        )}
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
      <div style={{ margin: "0 20px 16px", background: "#fff", border: `3px solid ${BORDER}`, borderRadius: "20px", padding: "18px 72px 42px 20px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: BLUE }}>{post?.title}</span>
          <button
            onClick={toggleLike}
            aria-pressed={liked}
            style={{
              position: "absolute",
              top: "50%",
              right: "24px",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              border: "none",
              background: "transparent",
              color: BLUE,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontFamily: FONT,
              fontWeight: "700",
              padding: 0,
            }}
            title="관심상품"
          >
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
          <div
            aria-label={`관심 ${interestCount}명`}
            style={{
              position: "absolute",
              right: "24px",
              bottom: "15px",
              width: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "5px",
              color: "#A1A5AF",
              fontSize: "13px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            <span style={{ color: "#C5C9D2", fontSize: "15px", lineHeight: 1 }}>♥</span>
            <span>{interestCount}</span>
          </div>
        </div>
      </div>

      {/* 상품 설명 카드 */}
      <div style={{ margin: "0 20px 24px", background: "#fff", border: `3px solid ${BORDER}`, borderRadius: "20px", padding: "18px 20px" }}>
        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.8", fontFamily: FONT, margin: 0, fontWeight: "700" }}>
          {post?.description}
        </p>
      </div>

      {/* 구매하기 / 메세지 보내기 버튼 */}
      <div style={{ padding: "0 20px", marginTop: "auto", paddingBottom: "32px" }}>
        {isOwnPost ? (
          <button
            disabled
            style={{
              width: "100%", padding: "15px",
              borderRadius: "50px", border: `3px solid ${BORDER}`,
              background: BG, color: BLUE,
              fontSize: "15px", fontFamily: FONT, fontWeight: "700",
              cursor: "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              letterSpacing: "0.05em",
            }}
          >
            내가 등록한 글입니다
          </button>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={handlePurchase}
              style={{
                width: "100%", padding: "15px 8px",
                borderRadius: "50px", border: `3px solid ${BORDER}`,
                background: "#fff", color: "#000",
                fontSize: "14px", fontFamily: FONT, fontWeight: "700",
                cursor: "pointer", transition: "background 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              구매하기
            </button>
            <button
              onClick={handleMessage}
              style={{
                width: "100%", padding: "15px 8px",
                borderRadius: "50px", border: `3px solid ${BORDER}`,
                background: "#fff", color: "#000",
                fontSize: "14px", fontFamily: FONT, fontWeight: "700",
                cursor: "pointer", transition: "background 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              메세지 보내기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
