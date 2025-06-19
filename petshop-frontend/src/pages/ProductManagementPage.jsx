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
    categoriaId: "",
  });
  const [error, setError] = useState("");

  const fetchProdutos = useCallback(async () => {
    setError("");
    try {
      const response = await getProdutos(page);
      setProdutos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Não foi possível carregar os produtos.");
      console.error("Erro ao buscar produtos:", err);
    }
  }, [page]);

  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Busca as categorias uma vez quando o componente é montado
  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleOpenModal = (produto = null) => {
    setError(""); // Limpa erros do formulário
    if (produto) {
      // Modo de Edição
      setEditingProduct(produto);
      setFormData({
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        categoriaId: produto.categoria.id, // Pega o ID da categoria para o select
      });
    } else {
      // Modo de Adição
      setEditingProduct(null);
      setFormData({ nome: "", preco: "", quantidade: "", categoriaId: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (produtoId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deletarProduto(produtoId);
        // Atualiza a lista de produtos após a exclusão
        fetchProdutos();
      } catch (err) {
        setError("Falha ao excluir o produto.");
        console.error("Erro ao excluir produto:", err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Constrói o DTO (Data Transfer Object) para enviar à API
    const produtoData = {
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade, 10),
      // A API espera o objeto da categoria, vamos montar um com o ID selecionado
      categoria: { id: parseInt(formData.categoriaId, 10) },
    };

    try {
      if (editingProduct) {
        // Atualiza o produto existente
        await atualizarProduto(editingProduct.id, produtoData);
      } else {
        // Cria um novo produto
        await criarProduto(produtoData);
      }
      handleCloseModal();
      fetchProdutos();
    } catch (err) {
      setError("Erro ao salvar o produto. Verifique os dados.");
      console.error("Erro no formulário:", err);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Gerenciamento de Produtos</h1>
      <div className="toolbar">
        {/* CORRIGIDO */}
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
          Adicionar Novo Produto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.categoria?.nome}</td>
                <td>R$ {Number(produto.preco).toFixed(2)}</td>
                <td>{produto.quantidade}</td>
                <td>
                  {/* CORRIGIDO */}
                  <button
                    onClick={() => handleOpenModal(produto)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: "8px" }}
                  >
                    <i
                      className="fas fa-edit"
                      style={{ marginRight: "4px" }}
                    ></i>
                    Editar
                  </button>
                  {/* CORRIGIDO */}
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i
                      className="fas fa-trash-alt"
                      style={{ marginRight: "4px" }}
                    ></i>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          {/* ... sua lógica de paginação ... */}
        </div>
      )}

      {/* MODAL (AGORA FUNCIONAL) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Campos do Formulário */}
              <div className="form-group">
                <label htmlFor="nome">Nome do Produto</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoriaId">Categoria</label>
                <select
                  id="categoriaId"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="preco">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Ações do Modal */}
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
