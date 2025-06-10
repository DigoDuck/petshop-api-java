import { useState, useEffect, useCallback } from "react";
import { getTodosPedidos, atualizarStatusPedido } from "../services/apiService";

const OrderManagementPage = () => {
  const [ordersPage, setOrdersPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllOrders = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await getTodosPedidos({
        page,
        size: 10,
        sort: "data,desc",
      });
      setOrdersPage(response.data);
    } catch (err) {
      setError("Falha ao carregar os pedidos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await atualizarStatusPedido(orderId, newStatus);
      // Atualiza a lista para refletir a mudança
      fetchAllOrders(ordersPage?.number || 0);
    } catch (err) {
      alert("Falha ao atualizar o status do pedido.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h3>Carregando todos os pedidos...</h3>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="page-title">Gerenciamento de Pedidos</h1>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th className="text-end">Total</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersPage &&
                ordersPage.content.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>{order.cliente.email}</td>
                    <td>{new Date(order.data).toLocaleString("pt-BR")}</td>
                    <td className="text-end">
                      R$ {Number(order.total).toFixed(2)}
                    </td>
                    <td className="text-center" style={{ minWidth: "180px" }}>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="PROCESSANDO">Processando</option>
                        <option value="ENVIADO">Enviado</option>
                        <option value="ENTREGUE">Entregue</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
