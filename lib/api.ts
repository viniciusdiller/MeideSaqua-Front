const API_URL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== "undefined" && (window as any).NEXT_PUBLIC_API_URL
    ? (window as any).NEXT_PUBLIC_API_URL
    : "";

// Função genérica para chamadas à API
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
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

/**
 * Envia um pedido de recuperação de senha.
 *  '/api/auth/recuperar-senha' vinicius precisa criar.*/
export const requestPasswordReset = (data: any) =>
  fetchApi("/api/auth/recuperar-senha", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAllEstablishments = () => fetchApi("/api/estabelecimentos");

export const getEstablishmentById = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}`);

export const getEstablishmentRating = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}/media`);

export const searchEstablishmentsByName = (name: string) =>
  fetchApi(`/api/estabelecimentos/buscar?nome=${name}`);

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

export const updateUserProfile = (data: any, token: string) =>
  fetchApi("/api/users/profile", {
    method: "PUT", // PUT é usado para atualizar um recurso existente
    headers: {
      Authorization: `Bearer ${token}`, // Envia o token para autorização
    },
    body: JSON.stringify(data),
  });

export const changePassword = (data: any, token: string) =>
  fetchApi("/api/users/password", {
    // <- Sua última função atual
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

// NOVA FUNÇÃO PARA ATUALIZAR O AVATAR
export const updateUserAvatar = (avatar: string, token: string) =>
  fetchApi("/api/users/avatar", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar }), // O backend espera {"avatar": "nome-do-arquivo.png"}
  });

/**
 * Altera a senha do usuário logado.
 *  O endpoint '/api/users/change-password' é uma possibilidade, precisa ser criado.
 * Requer um token de autenticação.
 */
export const changePasswordLogged = (data: any, token: string) =>
  fetchApi("/api/users/change-password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
