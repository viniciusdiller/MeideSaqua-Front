const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Função principal para chamadas de API.
 * Lida com headers, FormData, e tratamento de erros.
 */
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Adiciona Content-Type: application/json se o body existir e NÃO for FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Adiciona o header de Autorização se ele foi passado nas opções
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
  let data: any;

  try {
    // Tenta parsear o JSON, se falhar, usa um objeto de erro com o texto
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { message: text || "Resposta inválida da API" };
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data.message
        ? data.message
        : `API error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==================================================================
// --- Funções de Autenticação e Usuário ---
// ==================================================================

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

export const confirmEmailChange = (token: string) =>
  fetchApi(`/api/auth/confirm-email-change?token=${token}`, {
    method: "GET",
  });

export const resetPassword = (data: { token: string; newPassword: string }) =>
  fetchApi("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ==================================================================
// --- Funções Específicas de ESTABELECIMENTO (MeideSaqua) ---
// ==================================================================

/**
 * Busca todos os estabelecimentos ATIVOS (o backend já faz esse filtro)
 */
export const getAllEstablishments = () => fetchApi("/api/estabelecimentos");

/**
 * Busca um estabelecimento ATIVO específico pelo ID.
 */
export const getEstablishmentById = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}`);

/**
 * Busca avaliações de um ESTABELECIMENTO.
 * O nome está correto (getReviewsByEstablishment) para bater com a página MEI.
 */
export const getReviewsByEstablishment = (id: string) =>
  fetchApi(`/api/avaliacoes/estabelecimento/${id}`);

// ==================================================================
// --- Funções de Avaliação (MeideSaqua) ---
// ==================================================================

export const submitReview = (data: any, token: string) =>
  fetchApi("/api/avaliacoes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const deleteReview = (id: number, token: string) =>
  fetchApi(`/api/avaliacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ==================================================================
// --- Funções de ADMIN (MeideSaqua) ---
// ==================================================================

/**
 * [ADMIN] Busca todas as solicitações pendentes.
 */
export const getPendingAdminRequests = (token: string) =>
  fetchApi("/api/admin/pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * [ADMIN] Busca todos os estabelecimentos ativos (aprovados).
 * CORREÇÃO: Esta função agora chama a rota pública, que já retorna apenas os ativos.
 */
export const getAllActiveEstablishments = (token: string) =>
  fetchApi("/api/estabelecimentos", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * [ADMIN] Deleta (desativa) um estabelecimento.
 * CORREÇÃO: Aponta para a rota de alterar status para 'ativo: false'.
 */
export const adminDeleteEstablishment = (id: number, token: string) =>
  fetchApi(`/api/admin/estabelecimento/${id}`, { // Rota correta (a sua rota)
    method: "DELETE", // Método correto
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // O body não é necessário para um DELETE
  });

/**
 * [ADMIN] Atualiza um estabelecimento (usa FormData para arquivos).
 * CORREÇÃO: Aponta para a rota de solicitar atualização.
 */
export const adminUpdateEstablishment = (
  id: number, // O ID não é usado na URL, mas é mantido por consistência
  data: FormData,
  token: string
) =>
  fetchApi(`/api/estabelecimentos/solicitar-atualizacao`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

// ==================================================================
// --- Funções Utilitárias (Comuns) ---
// ==================================================================

export const removeEmojis = (text: string): string => {
  if (!text) return "";
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
};

export function formatarDataParaMesAno(dateString: string): string {
  if (!dateString) {
    return "";
  }
  const data = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(data);
}

