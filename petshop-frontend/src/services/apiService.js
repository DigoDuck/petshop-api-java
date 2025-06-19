import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir o token JWT
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function loginUsuario(dados) {
  return apiService.post("/auth/login", dados);
}

// faz a chamada de registro
export function cadastrarUsuario(dados) {
  return apiService.post("/auth/registrar", dados);
}

export function getProdutos(pageable) {
  return apiService.get("/api/produtos", { params: pageable });
}

export function criarProduto(produto) {
  return apiService.post("/api/produtos", produto);
}

export function atualizarProduto(id, produto) {
  return apiService.put(`/api/produtos/${id}`, produto);
}

export function deletarProduto(id) {
  return apiService.delete(`/api/produtos/${id}`);
}

export function getCategorias() {
  return apiService.get("/api/categorias");
}

export function criarPedido(pedidoDTO) {
  return apiService.post("/api/pedidos", pedidoDTO);
}

export function getTodosPedidos(pageable) {
  return apiService.get("/api/pedidos/admin/todos", { params: pageable });
}

export function atualizarStatusPedido(pedidoId, novoStatus) {
  return apiService.patch(`/api/pedidos/admin/${pedidoId}/status`, {
    novoStatus,
  });
}

export function getMeusPedidos(pageable) {
  return apiService.get("/api/pedidos/meus-pedidos", { params: pageable });
}

export function getMeusPets() {
  return apiService.get("/api/pets/meus-pets");
}

export function criarPet(petData) {
  return apiService.post("/api/pets", petData);
}

export function deletarPet(petId) {
  return apiService.delete(`/api/pets/${petId}`);
}

export function getMeusAgendamentos(pageable) {
  return apiService.get("/api/agendamentos/meus-agendamentos", {
    params: pageable,
  });
}

export function criarAgendamento(agendamentoData) {
  return apiService.post("/api/agendamentos", agendamentoData);
}

export function cancelarAgendamento(agendamentoId) {
  return apiService.patch(`/api/agendamentos/${agendamentoId}/status`, {
    novoStatus: "CANCELADO",
  });
}

export function enviarMensagemContato(dados) {
  return apiService.post("/api/contact", dados);
}

export default apiService;
