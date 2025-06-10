import { useState, useEffect, useCallback } from "react";
import { getProdutos } from "../services/apiService";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const ProductListPage = () => {
  // Inicializa os estados com valores padrão seguros (arrays vazios, etc.)
  const [produtos, setProdutos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  const fetchProdutos = useCallback(async (pagina) => {
    setLoading(true);
    setError(""); // Limpa erros anteriores a cada nova busca
    try {
      const response = await getProdutos({
        page: pagina,
        size: 9,
        sort: "nome,asc",
      });

      // Garante que os dados existem e estão no formato esperado
      if (response.data && Array.isArray(response.data.content)) {
        setProdutos(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        // Define como vazio se o formato for inesperado para evitar erros
        setProdutos([]);
        setTotalPages(0);
      }
    } catch (err) {
      setError(
        "Não foi possível carregar os produtos. Tente recarregar a página."
      );
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os produtos quando o componente monta ou quando a página muda
  useEffect(() => {
    fetchProdutos(page);
  }, [page, fetchProdutos]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h3>Carregando produtos...</h3>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-danger mx-auto" style={{ maxWidth: "800px" }}>
        {error}
      </div>
    );

  return (
    <div className="container py-4">
      <h1 className="page-title">Nossos Produtos</h1>

      {produtos.length > 0 ? (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="col">
                <div className="card h-100 product-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title product-title">{produto.nome}</h5>
                    <p className="card-text text-muted">
                      {produto.categoria?.nome}
                    </p>
                    <div className="mt-auto">
                      <h4 className="product-price">
                        R$ {Number(produto.preco).toFixed(2)}
                      </h4>
                      <small className="text-muted mb-3 d-block">
                        {produto.quantidade > 0
                          ? `${produto.quantidade} em estoque`
                          : "Produto indisponível"}
                      </small>
                      <button
                        onClick={() => addToCart(produto)}
                        className="btn btn-primary w-100"
                        disabled={produto.quantidade === 0}
                      >
                        <i className="fas fa-cart-plus me-2"></i>
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Anterior
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Página {page + 1} de {totalPages}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    page >= totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Próxima
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center p-5">
          <h3>Nenhum produto encontrado.</h3>
          <p>Novos produtos serão adicionados em breve.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
