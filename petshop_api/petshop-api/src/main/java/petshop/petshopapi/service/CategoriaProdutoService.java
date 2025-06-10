package petshop.petshopapi.service;

import petshop.petshopapi.entity.CategoriaProduto;
import petshop.petshopapi.repository.CategoriaProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaProdutoService {

    @Autowired
    private CategoriaProdutoRepository categoriaProdutoRepository;

    public CategoriaProduto salvar(CategoriaProduto categoria) {
        return categoriaProdutoRepository.save(categoria);
    }

    public List<CategoriaProduto> listarTodas() {
        return categoriaProdutoRepository.findAll();
    }

    public Optional<CategoriaProduto> buscarPorId(Long id) {
        return categoriaProdutoRepository.findById(id);
    }

    public CategoriaProduto atualizar(Long id, CategoriaProduto categoriaAtualizada) {
        CategoriaProduto categoriaExistente = categoriaProdutoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com o id: " + id));
        categoriaExistente.setNome(categoriaAtualizada.getNome());
        return categoriaProdutoRepository.save(categoriaExistente);
    }

    public void deletar(Long id) {
        if (!categoriaProdutoRepository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada com o id: " + id);
        }
        categoriaProdutoRepository.deleteById(id);
    }
}

