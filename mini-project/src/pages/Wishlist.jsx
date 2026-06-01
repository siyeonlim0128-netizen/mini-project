import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getAccessToken } from "../api";

const FONT = "'Intel One Mono', 'Courier New', monospace";
const BG = "#D4E1FD";
const BORDER = "#7999E9";
const BLUE = "#3a5fa8";
const LIGHT_BLUE = "#7da3e8";

const getPostId = (product) =>
  product?.postId ??
  product?.goodsId ??
  product?.goods_id ??
  product?.post_id ??
  product?.id;

const normalizeProduct = (product) => {
  const postId = getPostId(product);
  const isFree = Boolean(product?.isFree || product?.is_free);
  const price =
    typeof product?.price === "number"
      ? `${product.price.toLocaleString()}원`
      : product?.price || "0원";

  return {
    postId,
    title: product?.title || product?.name || "제목 없음",
    price,
    isFree,
    thumbnailUrl:
      product?.thumbnailUrl ||
      product?.thumbnail_url ||
      product?.image ||
      product?.images?.[0] ||
      null,
  };
};

const extractWishlist = (response) => {
  const data = response?.data;
  if (Array.isArray(data?.wishLists)) return data.wishLists;
  if (Array.isArray(data?.wishlist)) return data.wishlist;
  if (Array.isArray(data?.wishes)) return data.wishes;
  if (Array.isArray(data)) return data;
  return [];
};

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!getAccessToken()) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/api/wish_lists", { auth: true });
        const backendWishlist = extractWishlist(response)
          .map(normalizeProduct)
          .filter((product) => product.postId);
        setWishlist(backendWishlist);
        setError("");
      } catch (err) {
        setWishlist([]);
        setError("관심상품 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeItem = async (postId) => {
    if (!getAccessToken()) return;

    try {
      await apiFetch(`/api/wishes/${postId}`, {
        method: "DELETE",
        auth: true,
      });
      setWishlist((prev) =>
        prev.filter((product) => String(product.postId) !== String(postId))
      );
    } catch (err) {
      alert("관심상품 삭제에 실패했습니다.");
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
      <h1 style={{
        fontSize: "22px", fontWeight: "700", color: BLUE,
        marginBottom: "24px", letterSpacing: "0.05em",
      }}>
        관심상품
      </h1>

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
            관심상품이 없습니다.
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
              <div style={{
                width: "64px", height: "64px", borderRadius: "10px",
                background: "#c5d8f8", flexShrink: 0,
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#6b8fd4", fontFamily: FONT,
              }}>
                {product.thumbnailUrl
                  ? <img src={product.thumbnailUrl} alt="상품 사진" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "사진"
                }
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: BLUE }}>{product.title}</div>
                <div style={{ fontSize: "12px", color: "#6b8fd4", marginTop: "4px" }}>
                  {product.isFree ? "무료나눔" : product.price}
                </div>
              </div>

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
