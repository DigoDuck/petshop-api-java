import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-paw me-2"></i>Petshop Angels
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isAuthPage && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/produtos">
                  Produtos
                </NavLink>
              </li>
            )}

            {isAuthenticated ? (
              // --- MENU PARA USUÁRIO LOGADO ---
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/meus-pets">
                    Meus Pets
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/meus-pedidos">
                    Meus Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/meus-agendamentos">
                    Agendamentos
                  </NavLink>
                </li>
                {user?.roles?.includes("ROLE_ADMIN") && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Gerenciar
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/admin/produtos">
                          Gerenciar Produtos
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/pedidos">
                          Gerenciar Pedidos
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink
                    className="nav-link d-flex align-items-center"
                    to="/carrinho"
                  >
                    <i className="fas fa-shopping-cart me-1"></i>
                    Carrinho
                    {itemCount > 0 && (
                      <span className="badge bg-danger ms-2">{itemCount}</span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-3">
                  <button onClick={logout} className="btn btn-outline-light">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-3">
                {location.pathname === "/login" ? (
                  <Link className="btn btn-success" to="/register">
                    Cadastre-se
                  </Link>
                ) : (
                  <Link className="btn btn-primary" to="/login">
                    Login
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
