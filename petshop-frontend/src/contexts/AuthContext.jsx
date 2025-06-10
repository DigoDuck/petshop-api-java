import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUsuario as apiLogin } from "../services/apiService";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Verifica se o token não expirou
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({ email: decodedUser.sub, roles: decodedUser.roles || [] });
        } else {
          localStorage.removeItem("authToken"); // Limpa token expirado
        }
      } catch (error) {
        console.error("Token inválido ou expirado.", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await apiLogin({ email, senha });
      const { jwt: token } = response.data;
      localStorage.setItem("authToken", token);
      const decodedUser = jwtDecode(token);
      const userPayload = {
        email: decodedUser.sub,
        roles: decodedUser.roles || [],
      };
      setUser(userPayload);
      return userPayload;
    } catch (error) {
      console.error("Falha no login:", error);
      logout();
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
