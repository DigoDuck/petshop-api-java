import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import AppointmentPage from "./pages/AppointmentPage";
import PetManagementPage from "./pages/PetManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage.jsx";
import OrderManagementPage from "./pages/OrderManagementPage.jsx";

function App() {
  return (
    <>
      {/* Componente para renderizar as notificações em qualquer lugar do app */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "var(--cor-sucesso)",
              color: "white",
            },
          },
          error: {
            style: {
              background: "var(--cor-erro)",
              color: "white",
            },
          },
        }}
      />

      <div className="app">
        <Navbar />
        <main className="container main-content">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Rotas Protegidas para Usuários Autenticados */}
            <Route
              path="/produtos"
              element={
                <ProtectedRoute>
                  <ProductListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrinho"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-pedidos"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-agendamentos"
              element={
                <ProtectedRoute>
                  <AppointmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-pets"
              element={
                <ProtectedRoute>
                  <PetManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Rotas Protegidas apenas para ADMIN */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/produtos" replace />}
            />
            <Route
              path="/admin/produtos"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ProductManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute adminOnly={true}>
                  <OrderManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Rota "Catch-all" para 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
