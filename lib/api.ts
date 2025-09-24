const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.headers && "Authorization" in options.headers) {
    headers["Authorization"] = (options.headers as Record<string, string>)[
      "Authorization"
    ];
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data.message
        ? data.message
        : `API error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const registerUser = (data: any) =>
  fetchApi("/api/auth/cadastro", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data: any) =>
  fetchApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const confirmAccount = (token: string) =>
  fetchApi(`/api/auth/confirm-account?token=${token}`, {
    method: "GET",
  });

export const updateUserProfile = (
  data: { nomeCompleto?: string; email?: string },
  token: string
) =>
  fetchApi("/api/users/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const changeUserPassword = (
  data: { currentPassword?: string; newPassword?: string },
  token: string
) =>
  fetchApi("/api/users/password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const requestPasswordReset = (data: { email: string }) =>
  fetchApi("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUserAccount = (token: string) =>
  fetchApi("/api/users/profile", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllEstablishments = () => fetchApi("/api/estabelecimentos");

export const getEstablishmentById = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}`);

export const getReviewsByEstablishment = (id: string) =>
  fetchApi(`/api/avaliacoes/estabelecimento/${id}`);

export const submitReview = (data: any, token: string) =>
  fetchApi("/api/avaliacoes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const confirmEmailChange = (token: string) =>
  fetchApi(`/api/auth/confirm-email-change?token=${token}`, {
    method: "GET",
  });

export const resetPassword = (data: { token: string; newPassword: string }) =>
  fetchApi("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteReview = (id: number, token: string) =>
  fetchApi(`/api/avaliacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Remove emojis de uma string.
 * @param text A string de entrada.
 * @returns A string sem emojis.
 */
export const removeEmojis = (text: string): string => {
  if (!text) return "";
  // Regex que corresponde aos emojis para substituí-los por uma string vazia
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
};
