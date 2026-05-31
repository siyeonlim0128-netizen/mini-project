export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://boo-be-production.up.railway.app";

export const getAccessToken = () => localStorage.getItem("accessToken");

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
