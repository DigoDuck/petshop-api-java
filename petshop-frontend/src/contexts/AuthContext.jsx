import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUsuario as apiLogin } from "../services/apiService";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. 'isAuthenticated' agora é um estado. O valor inicial `null` significa "verificando...".
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({ email: decodedUser.sub, roles: decodedUser.roles || [] });
          // 2. Atualiza o estado de autenticação para 'true'
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false); // Token expirado, não autenticado
        }
      } catch (error) {
        console.error("Token inválido ou expirado.", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false); // Token inválido, não autenticado
      }
    } else {
      setIsAuthenticated(false); // Sem token, não autenticado
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
      // 3. Atualiza o estado de autenticação para 'true' após o login
      setIsAuthenticated(true);
      return userPayload;
    } catch (error) {
      console.error("Falha no login:", error);
      logout(); // logout já define isAuthenticated para false
      throw error; // Lança o erro para a página de login poder tratar
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    // 4. Atualiza o estado de autenticação para 'false' no logout
    setIsAuthenticated(false);
  };

  // 5. PONTO CHAVE: Se ainda estamos verificando (estado inicial), não renderize o app.
  //    Isso pausa o `ProtectedRoute` e resolve a condição de corrida.
  if (isAuthenticated === null) {
    return <div>Carregando sua sessão...</div>; // Ou um componente de spinner
  }

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