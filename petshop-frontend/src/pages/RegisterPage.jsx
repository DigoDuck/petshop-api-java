import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarUsuario } from "../services/apiService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await cadastrarUsuario({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: "CLIENTE",
      });

      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para a página de login."
      );
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Falha no cadastro. O e-mail já pode estar em uso.";
      setError(errorMsg);
      console.error("Erro de cadastro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Crie sua Conta</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                className="form-control"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                className="form-control"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Já tem uma conta? <Link to="/login">Faça o login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
