import { useState, useEffect, useCallback } from "react";
import { getMeusPets, criarPet, deletarPet } from "../services/apiService";

const PetManagementPage = () => {
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({ nome: "", tipo: "", raca: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Função para buscar os pets do usuário
  const fetchPets = useCallback(async () => {
    try {
      const response = await getMeusPets();
      setPets(response.data);
    } catch (err) {
      setError("Falha ao carregar seus pets.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa a busca de pets quando o componente é montado
  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Lida com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lida com o envio do formulário para criar um novo pet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await criarPet(formData);
      setSuccess("Pet adicionado com sucesso!");
      setFormData({ nome: "", tipo: "", raca: "" }); // Limpa o formulário
      fetchPets(); // Atualiza a lista
    } catch (err) {
      setError("Erro ao adicionar o pet. Verifique os dados.");
      console.error(err);
    }
  };

  // Lida com a exclusão de um pet
  const handleDelete = async (petId) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        await deletarPet(petId);
        setSuccess("Pet excluído com sucesso!");
        fetchPets();
      } catch (err) {
        setError("Erro ao excluir o pet.");
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h3>Carregando seus pets...</h3>
      </div>
    );

  return (
    <div className="container py-4">
      <h1 className="page-title">Meus Pets</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        {/* Coluna do Formulário */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Adicionar Novo Pet</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">
                    Tipo (ex: Cachorro, Gato)
                  </label>
                  <input
                    type="text"
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="raca" className="form-label">
                    Raça
                  </label>
                  <input
                    type="text"
                    id="raca"
                    name="raca"
                    value={formData.raca}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Adicionar Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Coluna da Lista de Pets */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5>Pets Cadastrados</h5>
            </div>
            {pets.length > 0 ? (
              <ul className="list-group list-group-flush">
                {pets.map((pet) => (
                  <li
                    key={pet.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span className="fw-bold">{pet.nome}</span>
                      <br />
                      <small className="text-muted">
                        {pet.tipo} - {pet.raca}
                      </small>
                    </div>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="fas fa-trash-alt"></i> Excluir
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card-body text-center text-muted">
                <p>Você ainda não cadastrou nenhum pet.</p>
                <p>Use o formulário ao lado para começar!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetManagementPage;
