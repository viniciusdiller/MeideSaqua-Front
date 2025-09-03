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

// --- AUTENTICAÇÃO ---
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

export const getAverageRating = async (establishmentId: string) => {
  // Chama a URL: http://localhost:8080/api/estabelecimentos/{id}/media
  const response = await fetch(
    `${API_URL}/estabelecimentos/${establishmentId}/media`
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar a média de avaliações");
  }

  const data = await response.json();
  // O backend retorna { "media": 4.5 }, então nós extraímos o valor.
  return data.media;
};

export const getAllEstablishments = () => fetchApi("/api/estabelecimentos");

export const getEstablishmentById = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}`);

export const getEstablishmentRating = (id: string) =>
  fetchApi(`/api/estabelecimentos/${id}/media`);

export const searchEstablishmentsByName = (name: string) =>
  fetchApi(`/api/estabelecimentos/buscar?nome=${name}`);

// AVALIAÇÕES
export const getReviewsByEstablishment = (id: string) =>
  fetchApi(`/api/avaliacoes/estabelecimento/${id}`);

export const submitReview = (data: any) =>
  fetchApi("/api/avaliacoes", {
    method: "POST",
    body: JSON.stringify(data),
    // adicionar um token de autenticação, que o backend deve fornecer após o login
    // Exemplo: headers: { 'Authorization': `Bearer ${token}` }
  });
