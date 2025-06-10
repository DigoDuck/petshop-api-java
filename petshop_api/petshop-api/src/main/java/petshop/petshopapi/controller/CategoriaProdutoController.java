package petshop.petshopapi.controller;

import petshop.petshopapi.entity.CategoriaProduto;
import petshop.petshopapi.service.CategoriaProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaProdutoController {

    private final CategoriaProdutoService categoriaProdutoService;

    public CategoriaProdutoController(CategoriaProdutoService categoriaProdutoService) {
        this.categoriaProdutoService = categoriaProdutoService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Apenas ADMIN pode criar
    public ResponseEntity<CategoriaProduto> criarCategoria(@RequestBody CategoriaProduto categoria) {
        return ResponseEntity.ok(categoriaProdutoService.salvar(categoria));
    }

    @GetMapping
    // Qualquer usuário autenticado pode listar
    public ResponseEntity<List<CategoriaProduto>> listarCategorias() {
        return ResponseEntity.ok(categoriaProdutoService.listarTodas());
    }

    @GetMapping("/{id}")
    // Qualquer usuário autenticado pode buscar por ID
    public ResponseEntity<CategoriaProduto> buscarCategoriaPorId(@PathVariable Long id) {
        return categoriaProdutoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Apenas ADMIN pode atualizar
    public ResponseEntity<CategoriaProduto> atualizarCategoria(@PathVariable Long id, @RequestBody CategoriaProduto categoria) {
        return ResponseEntity.ok(categoriaProdutoService.atualizar(id, categoria));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Apenas ADMIN pode deletar
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        categoriaProdutoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}