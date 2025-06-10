package petshop.petshopapi.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import petshop.petshopapi.dto.AgendamentoRequestDTO;
import petshop.petshopapi.dto.AgendamentoResponseDTO;
import petshop.petshopapi.dto.StatusAgendamentoUpdateDTO;
import petshop.petshopapi.entity.Usuario;
import petshop.petshopapi.service.AgendamentoService;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(@Valid @RequestBody AgendamentoRequestDTO agendamentoDTO,
                                                                   @AuthenticationPrincipal Usuario usuarioLogado) {
        AgendamentoResponseDTO novoAgendamento = agendamentoService.criarAgendamento(agendamentoDTO, usuarioLogado);
        return ResponseEntity.ok(novoAgendamento);
    }

    @GetMapping("/meus-agendamentos")
    public ResponseEntity<Page<AgendamentoResponseDTO>> listarMeusAgendamentos(@AuthenticationPrincipal Usuario usuarioLogado, Pageable pageable) {
        return ResponseEntity.ok(agendamentoService.listarPorDonoDePet(usuarioLogado.getId(), pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @agendamentoService.buscarPorId(#id).get().pet.dono.id == principal.id")
    public ResponseEntity<AgendamentoResponseDTO> buscarAgendamentoPorId(@PathVariable Long id) {
        return agendamentoService.buscarPorIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or @agendamentoService.buscarPorId(#id).get().pet.dono.id == principal.id")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(@PathVariable Long id, @RequestBody StatusAgendamentoUpdateDTO statusUpdateDTO) {
        AgendamentoResponseDTO agendamentoAtualizado = agendamentoService.atualizarStatus(id, statusUpdateDTO.getNovoStatus());
        return ResponseEntity.ok(agendamentoAtualizado);
    }

    // --- Endpoints para ADMIN ---

    @GetMapping("/admin/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AgendamentoResponseDTO>> listarTodosAgendamentos(Pageable pageable) {
        return ResponseEntity.ok(agendamentoService.listarTodos(pageable));
    }

    @GetMapping("/admin/pet/{petId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosPorPetId(@PathVariable Long petId) {
        return ResponseEntity.ok(agendamentoService.listarPorPetId(petId));
    }
}