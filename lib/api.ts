// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Função genérica para chamadas à API
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Garante que o token seja adicionado se existir
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
    // Extrai a mensagem de erro do backend, se disponível
    const errorMessage =
      typeof data === "object" && data.message
        ? data.message
        : `API error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

// Funções de Autenticação
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

// Funções de Perfil do Usuário
/**
 * Atualiza o perfil do usuário (nome completo e email).
 * Requer token de autenticação.
 */
export const updateUserProfile = (
  data: { nomeCompleto?: string; email?: string },
  token: string
) =>
  fetchApi("/api/users/profile", {
    method: "POST", // Baseado no @PostMapping do seu UserController
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

/**
 * Altera a senha do usuário logado.
 * Requer token de autenticação e a senha atual.
 */
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

/**
 * Exclui a conta do usuário logado.
 * Requer token de autenticação.
 */
export const deleteUserAccount = (token: string) =>
  fetchApi("/api/users/profile", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Funções de Estabelecimentos e Avaliações
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
