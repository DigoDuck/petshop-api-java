import { useState, useEffect, useCallback } from "react";
import {
  getProdutos,
  deletarProduto,
  getCategorias,
  criarProduto,
  atualizarProduto,
} from "../services/apiService";

const ProductManagementPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    categoria: { id: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProdutos = useCallback(async (pagina) => {
    setLoading(true);
    setError("");
    try {
      const response = await getProdutos({
        page: pagina,
        size: 10,
        sort: "nome,asc",
      });
      setProdutos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Falha ao carregar produtos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (err) {
      setError("Falha ao carregar categorias.");
    }
  };

  useEffect(() => {
    fetchProdutos(page);
    fetchCategorias();
  }, [page, fetchProdutos]);


  const handleOpenModal = (produto = null) => {
    setEditingProduct(produto);
    if (produto) {
      setFormData({
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        categoria: { id: produto.categoria.id },
      });
    } else {
      setFormData({
        nome: "",
        preco: "",
        quantidade: "",
        categoria: { id: "" },
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoriaId") {
      setFormData((prev) => ({ ...prev, categoria: { id: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await atualizarProduto(editingProduct.id, formData);
      } else {
        await criarProduto(formData);
      }
      handleCloseModal();
      fetchProdutos(page);
    } catch (err) {
      setError("Falha ao salvar o produto.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deletarProduto(id);
        fetchProdutos(page);
      } catch (err) {
        setError("Falha ao deletar produto.");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Gerenciamento de Produtos</h1>
      <div className="toolbar">
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          Adicionar Novo Produto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div>Carregando...</div>}

      {!loading && (
        <>
          <table className="table">
            <thead></thead>
            <tbody>
              {produtos &&
                produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria?.nome}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                      <button
                        onClick={() => handleOpenModal(produto)}
                        className="btn btn-secondary btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">{/* ... pagination controls ... */}</div>
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Categoria</label>
                <select
                  name="categoriaId"
                  value={formData.categoria.id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias &&
                    categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
