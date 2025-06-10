import { useState, useEffect, useCallback } from "react";
import {
  getMeusAgendamentos,
  getMeusPets,
  cancelarAgendamento,
  criarAgendamento,
} from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

const AppointmentPage = () => {
  const { user } = useAuth();

  // Estados
  const [agendamentosPage, setAgendamentosPage] = useState(null);
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    petId: "",
    dataHora: "",
    tipoServico: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Função para buscar os agendamentos
  const fetchAgendamentos = useCallback(async (page = 0) => {
    try {
      const response = await getMeusAgendamentos({
        page,
        size: 5,
        sort: "dataHora,desc",
      });
      setAgendamentosPage(response.data);
    } catch (err) {
      setError("Falha ao carregar seus agendamentos.");
    }
  }, []);

  // Busca os dados iniciais (pets e agendamentos)
  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Busca os pets do usuário para mostrar no formulário
        const petsResponse = await getMeusPets();
        setPets(petsResponse.data);
        // Busca a primeira página de agendamentos
        await fetchAgendamentos();
      } catch (err) {
        setError("Falha ao carregar dados da página.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user, fetchAgendamentos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await criarAgendamento(form);
      setSuccess("Agendamento criado com sucesso!");
      setForm({ petId: "", dataHora: "", tipoServico: "" }); // Limpa formulário
      fetchAgendamentos(); // Atualiza a lista
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar agendamento.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?"))
      return;

    setError("");
    setSuccess("");
    try {
      await cancelarAgendamento(id);
      setSuccess("Agendamento cancelado com sucesso!");
      fetchAgendamentos(); // Atualiza a lista para mostrar o novo status
    } catch (err) {
      setError("Erro ao cancelar agendamento.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h3>Carregando...</h3>
      </div>
    );

  return (
    <div className="container py-4">
      <h1 className="page-title">Agendamento de Serviços</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        {/* Coluna do Formulário de Novo Agendamento */}
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Marcar Novo Horário</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="petId" className="form-label">
                    Seu Pet
                  </label>
                  <select
                    id="petId"
                    name="petId"
                    className="form-select"
                    value={form.petId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="dataHora" className="form-label">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    id="dataHora"
                    name="dataHora"
                    className="form-control"
                    value={form.dataHora}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tipoServico" className="form-label">
                    Serviço Desejado
                  </label>
                  <input
                    type="text"
                    id="tipoServico"
                    name="tipoServico"
                    className="form-control"
                    value={form.tipoServico}
                    onChange={handleChange}
                    placeholder="Ex: Banho e Tosa"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Agendar Serviço
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Coluna da Lista de Agendamentos */}
        <div className="col-lg-7">
          <h5 className="mb-3">Seus Próximos Agendamentos</h5>
          <div className="list-group">
            {agendamentosPage && agendamentosPage.content.length > 0 ? (
              agendamentosPage.content.map((ag) => (
                <div
                  key={ag.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <div>
                    <p className="mb-1 fw-bold">
                      {ag.tipoServico} para {ag.pet.nome}
                    </p>
                    <small className="text-muted">
                      {new Date(ag.dataHora).toLocaleString("pt-BR")}
                    </small>
                  </div>
                  <div>
                    <span
                      className={`badge bg-${
                        ag.status === "CANCELADO" ? "danger" : "success"
                      } me-2`}
                    >
                      {ag.status}
                    </span>
                    {ag.status === "AGENDADO" && (
                      <button
                        onClick={() => handleCancel(ag.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted border rounded">
                Nenhum agendamento futuro encontrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
