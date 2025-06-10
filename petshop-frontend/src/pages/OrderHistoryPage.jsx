import { useState, useEffect, useCallback } from "react";
import { getMeusPedidos } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [ordersPage, setOrdersPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await getMeusPedidos({
        page,
        size: 10,
        sort: "data,desc",
      });
      setOrdersPage(response.data);
    } catch (err) {
      setError("Falha ao carregar o histórico de pedidos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (loading)
    return (
      <div className="text-center p-5">
        <h3>Carregando histórico...</h3>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="page-title">Meus Pedidos</h1>

      {ordersPage && ordersPage.content.length > 0 ? (
        <div className="accordion" id="ordersAccordion">
          {ordersPage.content.map((order, index) => (
            <div className="accordion-item" key={order.id}>
              <h2 className="accordion-header" id={`heading${order.id}`}>
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${order.id}`}
                >
                  <span className="fw-bold me-3">Pedido #{order.id}</span>
                  <span className="text-muted me-3">
                    Data: {new Date(order.data).toLocaleDateString("pt-BR")}
                  </span>
                  <span className={`badge bg-info`}>{order.status}</span>
                </button>
              </h2>
              <div
                id={`collapse${order.id}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                data-bs-parent="#ordersAccordion"
              >
                <div className="accordion-body">
                  <p>
                    <strong>
                      Total do Pedido: R$ {Number(order.total).toFixed(2)}
                    </strong>
                  </p>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qtd</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.itens.map((item, itemIndex) => (
                        <tr key={item.id || `item-${itemIndex}`}>
                          <td>{item.produto.nome}</td>
                          <td className="text-center">{item.quantidade}</td>
                          <td className="text-end">
                            R$ {Number(item.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 card shadow-sm">
          <h3>Nenhum pedido encontrado.</h3>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
