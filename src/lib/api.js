const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getAuthToken() {
  return localStorage.getItem("fitfloor-token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

const api = {
  health: () => request("/health"),

  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: payload }),
    login: (payload) => request("/auth/login", { method: "POST", body: payload }),
    me: () => request("/auth/me", { auth: true }),
    logout: () => request("/auth/logout", { method: "POST", auth: true }),
  },

  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/products/${id}`),
    getReviews: (id) => request(`/products/${id}/reviews`),
    addReview: (id, payload) =>
      request(`/products/${id}/reviews`, { method: "POST", body: payload, auth: true }),
  },

  cart: {
    get: () => request("/cart", { auth: true }),
    addItem: (payload) => request("/cart/items", { method: "POST", body: payload, auth: true }),
    updateItem: (itemId, payload) =>
      request(`/cart/items/${itemId}`, { method: "PATCH", body: payload, auth: true }),
    removeItem: (itemId) =>
      request(`/cart/items/${itemId}`, { method: "DELETE", auth: true }),
  },

  favorites: {
    get: () => request("/favorites", { auth: true }),
    add: (product) => request("/favorites", { method: "POST", body: { product }, auth: true }),
    remove: (productId) => request(`/favorites/${productId}`, { method: "DELETE", auth: true }),
  },

  orders: {
    create: (payload) => request("/orders", { method: "POST", body: payload, auth: true }),
    list: () => request("/orders", { auth: true }),
    getById: (id) => request(`/orders/${id}`, { auth: true }),
  },

  discounts: {
    validate: (payload) => request("/discounts/validate", { method: "POST", body: payload }),
    getByCode: (code) => request(`/discounts/${code}`),
  },

  fitQuiz: {
    submit: (payload) => request("/fit-quiz/responses", { method: "POST", body: payload, auth: true }),
    latest: () => request("/fit-quiz/recommendations", { auth: true }),
  },
};

export default api;
