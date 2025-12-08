const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Função principal para chamadas de API.
 * Lida com headers, FormData, e tratamento de erros 401.
 */
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Se o body NÃO for FormData, define Content-Type: application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Remove o Content-Type se for FormData (deixa o navegador definir)
  if (options.body instanceof FormData && headers["Content-Type"]) {
    delete headers["Content-Type"];
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
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { message: text || "Resposta inválida da API" };
  }

  if (!response.ok) {
    if (response.status === 401) {
      if (path !== "/api/auth/login") {
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Sessão expirada. Redirecionando para login...");
      }
    }

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
// --- Funções Específicas de ESTABELECIMENTO (Público) ---
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
 * Busca avaliações de um ESTABELECIMENTO (Rota Pública).
 */
export const getReviewsByEstablishment = (id: string) =>
  fetchApi(`/api/avaliacoes/estabelecimento/${id}`);

// ==================================================================
// --- Funções do Formulário CADASTRO-MEI (Requer Auth) ---
// ==================================================================

/**
 * [Formulário] Envia um novo cadastro de estabelecimento para aprovação.
 */
export const cadastrarEstabelecimento = (formData: FormData, token: string) =>
  fetchApi("/api/estabelecimentos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

/**
 * [Formulário] Envia uma solicitação de atualização para um estabelecimento existente.
 */
export const atualizarEstabelecimento = (formData: FormData, token: string) =>
  fetchApi("/api/estabelecimentos/solicitar-atualizacao", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

/**
 * [Formulário] Envia uma solicitação de exclusão para um estabelecimento.
 */
export const excluirEstabelecimento = (formData: FormData, token: string) =>
  fetchApi("/api/estabelecimentos/solicitar-exclusao", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

// ==================================================================
// --- Funções de Avaliação (Usuário Comum - Requer Auth) ---
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
// --- Funções de ADMIN (Requer Auth de Admin) ---
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
 */
export const adminDeleteEstablishment = (id: number, token: string) =>
  fetchApi(`/api/admin/estabelecimento/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * [ADMIN] Atualiza um estabelecimento (no modal de Estabelecimentos Ativos).
 */
export const adminUpdateEstablishment = (
  id: number,
  data: FormData,
  token: string
) =>
  fetchApi(`/api/admin/estabelecimento/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

/**
 * [ADMIN] Atualiza/Aprova um estabelecimento pendente (no Dashboard).
 */
export const adminEditAndApproveEstablishment = (
  id: number,
  data: FormData,
  token: string
) =>
  fetchApi(`/api/admin/edit-and-approve/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

/**
 * [ADMIN] Busca todas as avaliações de um estabelecimento específico.
 */
export const adminGetReviewsByEstablishment = (id: string, token: string) =>
  fetchApi(`/api/admin/avaliacoes/estabelecimento/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * [ADMIN] Deleta uma avaliação específica.
 */
export const adminDeleteReview = (id: number, token: string) =>
  fetchApi(`/api/admin/avaliacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
export const adminExportEstabelecimentos = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/exportar-estabelecimentos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao exportar estabelecimentos");
  }

  // Retorna o Blob do arquivo para download
  return response.blob();
};
