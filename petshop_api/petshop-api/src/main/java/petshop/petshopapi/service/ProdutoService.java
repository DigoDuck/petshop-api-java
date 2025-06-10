package petshop.petshopapi.service;

import petshop.petshopapi.entity.Produto;
import petshop.petshopapi.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Page<Produto> listarTodos(Pageable pageable) {
        return produtoRepository.findAll(pageable);
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o id: " + id));
        produtoExistente.setNome(produtoAtualizado.getNome());
        produtoExistente.setCategoria(produtoAtualizado.getCategoria());
        produtoExistente.setPreco(produtoAtualizado.getPreco());
        produtoExistente.setQuantidade(produtoAtualizado.getQuantidade());
        return produtoRepository.save(produtoExistente);
    }

    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com o id: " + id);
        }
        produtoRepository.deleteById(id);
    }

    public long contarProdutos() {
        return produtoRepository.count();
    }

    public void reduzirEstoque(Long produtoId, int quantidade) {
        Produto produto = buscarPorId(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado para redução de estoque."));
        if (produto.getQuantidade() < quantidade) {
            throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
        }
        produto.setQuantidade(produto.getQuantidade() - quantidade);
        produtoRepository.save(produto);
    }
}

