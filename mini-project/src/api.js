export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://boo-be-production.up.railway.app";

export const getAccessToken = () => localStorage.getItem("accessToken");

const LOCAL_WISHLIST_KEY = "localWishlist";
const LOCAL_POSTS_KEY = "localPostsSnapshot";

const getPostId = (post) =>
  post?.postId ?? post?.goodsId ?? post?.goods_id ?? post?.post_id ?? post?.id;

export const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalWishlistItem = (post) => {
  const postId = getPostId(post);
  if (!postId) return;

  const nextItem = {
    ...post,
    postId,
    id: postId,
  };
  const currentItems = getLocalWishlist().filter(
    (item) => String(getPostId(item)) !== String(postId)
  );

  localStorage.setItem(
    LOCAL_WISHLIST_KEY,
    JSON.stringify([nextItem, ...currentItems])
  );
};

export const removeLocalWishlistItem = (postId) => {
  localStorage.setItem(
    LOCAL_WISHLIST_KEY,
    JSON.stringify(
      getLocalWishlist().filter(
        (item) => String(getPostId(item)) !== String(postId)
      )
    )
  );
};

export const getLocalPostSnapshots = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalPostSnapshots = (posts) => {
  localStorage.setItem(
    LOCAL_POSTS_KEY,
    JSON.stringify(posts.filter((post) => getPostId(post)))
  );
};

const decodeTokenPayload = (token) => {
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;

    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getCurrentUser = () => {
  const tokenPayload = decodeTokenPayload(getAccessToken()) || {};
  const id =
    localStorage.getItem("userId") ||
    tokenPayload.userId ||
    tokenPayload.user_id ||
    tokenPayload.memberId ||
    tokenPayload.member_id ||
    tokenPayload.id ||
    "";
  const email =
    localStorage.getItem("email") ||
    tokenPayload.email ||
    tokenPayload.sub ||
    "";

  return {
    id: id ? String(id) : "",
    email: email ? String(email) : "",
    nickname:
      localStorage.getItem("nickname") ||
      tokenPayload.nickname ||
      tokenPayload.name ||
      "",
  };
};

export const isCurrentUserValue = (value) => {
  const currentUser = getCurrentUser();
  if (value === undefined || value === null) return false;

  const normalizedValue = String(value);
  return (
    Boolean(currentUser.id && normalizedValue === currentUser.id) ||
    Boolean(currentUser.email && normalizedValue === currentUser.email)
  );
};

export async function apiFetch(path, options = {}) {
  const { auth = false, headers, body, ...rest } = options;
  const token = getAccessToken();
  const requestHeaders = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "요청에 실패했습니다.");
  }

  return data;
}

export async function requestWish(postId, shouldLike) {
  const method = shouldLike ? "POST" : "DELETE";
  const paths = [
    `/api/wish_lists/${postId}`,
    `/api/wishes/${postId}`,
    `/api/wish-lists/${postId}`,
  ];
  let lastError;

  for (const path of paths) {
    try {
      return await apiFetch(path, { method, auth: true });
    } catch (error) {
      lastError = error;
    }
  }

  if (shouldLike) {
    try {
      return await apiFetch("/api/wish_lists", {
        method: "POST",
        auth: true,
        body: {
          postId,
          post_id: postId,
          goodsId: postId,
          goods_id: postId,
        },
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
