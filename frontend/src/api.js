const API_ROOT = "/api";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: "include",
    headers: isFormData
      ? { ...(options.headers || {}) }
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

export function fetchSession() {
  return request("/auth/session");
}

export function signup(body) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function login(body) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function fetchProperties(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/properties${suffix}`);
}

export function fetchPropertyById(id) {
  return request(`/properties/${id}`);
}

function buildPropertyFormData(property) {
  const formData = new FormData();
  const fields = ["title", "description", "location", "country", "categories", "price", "available"];
  fields.forEach((key) => {
    formData.append(`property[${key}]`, String(property[key]));
  });
  if (property.imageFile) {
    formData.append("property[image]", property.imageFile);
  }
  return formData;
}

export function createProperty(property) {
  return request("/properties", {
    method: "POST",
    body: buildPropertyFormData(property),
  });
}

export function updateProperty(id, property) {
  return request(`/properties/${id}`, {
    method: "PUT",
    body: buildPropertyFormData(property),
  });
}

export function deleteProperty(id) {
  return request(`/properties/${id}`, { method: "DELETE" });
}

export function createBooking(propertyId) {
  return request(`/properties/${propertyId}/bookings`, { method: "POST" });
}

export function fetchBookings() {
  return request("/bookings");
}

export function createReview(propertyId, review) {
  return request(`/properties/${propertyId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ review }),
  });
}

export function deleteReview(propertyId, reviewId) {
  return request(`/properties/${propertyId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
