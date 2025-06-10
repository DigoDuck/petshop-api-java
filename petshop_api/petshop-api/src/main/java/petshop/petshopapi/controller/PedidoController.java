package petshop.petshopapi.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import petshop.petshopapi.dto.PedidoRequestDTO;
import petshop.petshopapi.dto.PedidoResponseDTO;
import petshop.petshopapi.dto.StatusUpdateRequestDTO;
import petshop.petshopapi.entity.Usuario;
import petshop.petshopapi.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    // Injeção de dependência via construtor
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody PedidoRequestDTO pedidoDTO, @AuthenticationPrincipal Usuario usuarioLogado) {
        PedidoResponseDTO novoPedido = pedidoService.criarPedido(pedidoDTO, usuarioLogado);
        return ResponseEntity.ok(novoPedido);
    }

    @GetMapping("/meus-pedidos")
    public ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(@AuthenticationPrincipal Usuario usuarioLogado, Pageable pageable) {
        return ResponseEntity.ok(pedidoService.listarPorUsuarioId(usuarioLogado.getId(), pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @pedidoService.buscarPorId(#id).get().usuario.id == principal.id")
    public ResponseEntity<PedidoResponseDTO> buscarPedidoPorId(@PathVariable Long id) {
        return pedidoService.buscarPorIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Endpoints para ADMIN ---

    @GetMapping("/admin/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PedidoResponseDTO>> listarTodosPedidos(Pageable pageable) {
        return ResponseEntity.ok(pedidoService.listarTodos(pageable));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PedidoResponseDTO> atualizarStatusPedido(@PathVariable Long id, @RequestBody StatusUpdateRequestDTO statusUpdate) {
        PedidoResponseDTO pedidoAtualizado = pedidoService.atualizarStatus(id, statusUpdate.getNovoStatus());
        return ResponseEntity.ok(pedidoAtualizado);
    }
}