
const API_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_API_URL)
      ? (window as any).NEXT_PUBLIC_API_URL
      : '';

// Função genérica para chamadas à API
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Funções para cada endpoint da API

// --- AUTENTICAÇÃO ---
export const registerUser = (data: any) => fetchApi('/api/auth/cadastro', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const loginUser = (data: any) => fetchApi('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(data),
  // A documentação menciona Basic Auth, mas a resposta é JSON.
  // Se for Basic Auth, o header seria:
  // headers: { 'Authorization': 'Basic ' + btoa(`${data.username}:${data.senha}`) }
});


// --- ESTABELECIMENTOS ---
export const getAllEstablishments = () => fetchApi('/api/estabelecimentos');

export const getEstablishmentById = (id: string) => fetchApi(`/api/estabelecimentos/${id}`);

export const searchEstablishmentsByName = (name: string) => fetchApi(`/api/estabelecimentos/buscar?nome=${name}`);

// --- AVALIAÇÕES ---
export const getReviewsByEstablishment = (id: string) => fetchApi(`/api/avaliacoes/estabelecimento/${id}`);

export const submitReview = (data: any) => fetchApi('/api/avaliacoes', {
  method: 'POST',
  body: JSON.stringify(data),
  // adicionar um token de autenticação, que o backend deve fornecer após o login
  // Exemplo: headers: { 'Authorization': `Bearer ${token}` }
});