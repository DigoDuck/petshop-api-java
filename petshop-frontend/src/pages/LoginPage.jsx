import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, senha);
      if (user) {
        if (from === "/login" || from === "/register") {
          if (user.roles.includes("ROLE_ADMIN")) {
            navigate("/admin/produtos");
          } else {
            navigate("/");
          }
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError("Falha no login. Verifique seu email e senha.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      console.error("Erro de login no componente:", err);
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
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">
              Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
