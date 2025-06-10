import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { criarPedido } from "../services/apiService";

const OrderPage = () => {
  // Obtém todos os dados e funções do nosso CartContext
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinalizarPedido = async () => {
    if (!isAuthenticated) {
      setError("Você precisa estar logado para finalizar um pedido.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const pedidoDTO = {
        itens: cartItems.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
        })),
      };

      await criarPedido(pedidoDTO);

      setSuccess(
        "Pedido realizado com sucesso! Você será redirecionado para seu histórico de pedidos."
      );
      clearCart();

      setTimeout(() => {
        navigate("/meus-pedidos");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao finalizar o pedido. Verifique o estoque dos produtos."
      );
      console.error("Erro ao finalizar pedido:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="page-title">Meu Carrinho de Compras</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {cartItems.length > 0 ? (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "50%" }}>Produto</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.produto.id}>
                    <td>
                      <p className="fw-bold mb-0">{item.produto.nome}</p>
                      <small className="text-muted">
                        Preço Unitário: R${" "}
                        {Number(item.produto.preco).toFixed(2)}
                      </small>
                    </td>
                    <td>
                      <div
                        className="input-group input-group-sm"
                        style={{ maxWidth: "120px", margin: "auto" }}
                      >
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.produto.id, item.quantidade - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantidade}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.produto.id, item.quantidade + 1)
                          }
                          disabled={item.quantidade >= item.produto.quantidade}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end fw-bold">
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => removeFromCart(item.produto.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Remover item"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr className="fw-bold fs-5">
                  <td colSpan="2" className="text-end">
                    Total do Pedido:
                  </td>
                  <td colSpan="2" className="text-end">
                    R$ {totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="card-footer text-end p-3">
            <button
              onClick={handleFinalizarPedido}
              className="btn btn-primary btn-lg"
              disabled={loading || success}
            >
              {loading ? "Processando..." : "Finalizar Pedido"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-5 card shadow-sm">
          <h3>Seu carrinho está vazio.</h3>
          <p className="lead text-muted">
            Adicione produtos da nossa loja para continuar.
          </p>
          <div className="mt-3">
            <Link to="/produtos" className="btn btn-primary">
              Ver Produtos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
