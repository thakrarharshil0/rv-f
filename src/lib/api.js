const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const MEDIA_BASE = "http://localhost:8000"; // Adjust if media is served from a different URL

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${MEDIA_BASE}${url}`;
};

function getAuthToken() {
  return localStorage.getItem("royal-virtus-token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const isFormData = body instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
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
    socialLogin: (payload) => request("/auth/social-login", { method: "POST", body: payload }),
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
    create: (payload) => request("/products", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/products/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/products/${id}`, { method: "DELETE", auth: true }),
  },

  admin: {
    dashboardStats: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/dashboard-stats${query ? `?${query}` : ""}`, { auth: true });
    },
    salesAnalytics: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/sales-analytics${query ? `?${query}` : ""}`, { auth: true });
    },
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
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ""}`, { auth: true });
    },
    getById: (id) => request(`/orders/${id}`, { auth: true }),
    update: (id, payload) => request(`/orders/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/orders/${id}`, { method: "DELETE", auth: true }),
  },

  refunds: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/refunds${query ? `?${query}` : ""}`, { auth: true });
    },
    getById: (id) => request(`/refunds/${id}`, { auth: true }),
    create: (payload) => request("/refunds", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/refunds/${id}`, { method: "PATCH", body: payload, auth: true }),
  },

  categories: {
    list: () => request("/categories", { auth: true }),
    create: (payload) => request("/categories", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/categories/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/categories/${id}`, { method: "DELETE", auth: true }),
  },

  subCategories: {
    list: () => request("/sub-categories", { auth: true }),
    create: (payload) => request("/sub-categories", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/sub-categories/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/sub-categories/${id}`, { method: "DELETE", auth: true }),
  },

  productAttributes: {
    list: () => request("/product-attributes", { auth: true }),
    create: (payload) => request("/product-attributes", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/product-attributes/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/product-attributes/${id}`, { method: "DELETE", auth: true }),
  },

  banners: {
    list: () => request("/banners", { auth: true }),
    create: (payload) => request("/banners", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/banners/${id}`, { method: "POST", body: payload, auth: true }), // POST for multipart
    delete: (id) => request(`/banners/${id}`, { method: "DELETE", auth: true }),
    getActive: () => request("/public/banners"),
  },

  discounts: {
    validate: (payload) => request("/discounts/validate", { method: "POST", body: payload }),
    getByCode: (code) => request(`/discounts/${code}`),
    getPublic: () => request("/public/coupons"),
  },

  settings: {
    getPublic: () => request("/public/settings"),
    list: (group = 'general') => request(`/settings?group=${group}`, { auth: true }),
    update: (payload) => request("/settings", { method: "POST", body: payload, auth: true }),
  },

  fitQuiz: {
    submit: (payload) => request("/fit-quiz/responses", { method: "POST", body: payload, auth: true }),
    latest: () => request("/fit-quiz/recommendations", { auth: true }),
  },

  emailTemplates: {
    list: () => request("/email-templates", { auth: true }),
    getById: (id) => request(`/email-templates/${id}`, { auth: true }),
    create: (payload) => request("/email-templates", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/email-templates/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/email-templates/${id}`, { method: "DELETE", auth: true }),
  },

  businessPages: {
    list: () => request("/business-pages", { auth: true }),
    getById: (id) => request(`/business-pages/${id}`, { auth: true }),
    create: (payload) => request("/business-pages", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/business-pages/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/business-pages/${id}`, { method: "DELETE", auth: true }),
    getPublic: (slug) => request(`/public/business-pages/${slug}`),
  },

  customers: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/customers${query ? `?${query}` : ""}`, { auth: true });
    },
  },

  reviews: {
    adminList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/reviews${query ? `?${query}` : ""}`, { auth: true });
    },
    delete: (id) => request(`/admin/reviews/${id}`, { method: "DELETE", auth: true }),
    toggleApproval: (id) =>
      request(`/admin/reviews/${id}/toggle-approval`, { method: "PATCH", auth: true }),
  },

  loyalty: {
    transactions: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/loyalty/transactions${query ? `?${query}` : ""}`, { auth: true });
    },
    stats: () => request("/admin/loyalty/stats", { auth: true }),
  },

  employees: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/employees${query ? `?${query}` : ""}`, { auth: true });
    },
    create: (payload) => request("/admin/employees", { method: "POST", body: payload, auth: true }),
    delete: (id) => request(`/admin/employees/${id}`, { method: "DELETE", auth: true }),
  },

  coupons: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/coupons${query ? `?${query}` : ""}`, { auth: true });
    },
    create: (payload) => request("/admin/coupons", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/admin/coupons/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/admin/coupons/${id}`, { method: "DELETE", auth: true }),
    toggleStatus: (id) => request(`/admin/coupons/${id}/toggle-status`, { method: "PATCH", auth: true }),
  },

  flashDeals: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/flash-deals${query ? `?${query}` : ""}`, { auth: true });
    },
    create: (payload) => request("/admin/flash-deals", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/admin/flash-deals/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/admin/flash-deals/${id}`, { method: "DELETE", auth: true }),
    togglePublish: (id) => request(`/admin/flash-deals/${id}/toggle-publish`, { method: "PATCH", auth: true }),
    products: {
      list: (id) => request(`/admin/flash-deals/${id}/products`, { auth: true }),
      add: (id, payload) => request(`/admin/flash-deals/${id}/products`, { method: "POST", body: payload, auth: true }),
      remove: (id, productId) => request(`/admin/flash-deals/${id}/products/${productId}`, { method: "DELETE", auth: true }),
    },
  },

  bundles: {
    list: () => request("/public/bundles"),
    adminList: () => request("/admin/bundles", { auth: true }),
    create: (payload) => request("/admin/bundles", { method: "POST", body: payload, auth: true }),
    update: (id, payload) => request(`/admin/bundles/${id}`, { method: "PATCH", body: payload, auth: true }),
    delete: (id) => request(`/admin/bundles/${id}`, { method: "DELETE", auth: true }),
  },

  request: request,
};

// API Version: 1.0.8
export const businessPages = api.businessPages;
export const customers = api.customers;
export const reviews = api.reviews;
export const loyalty = api.loyalty;
export const employees = api.employees;
export const coupons = api.coupons;
export const flashDeals = api.flashDeals;
export default api;
