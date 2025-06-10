package petshop.petshopapi.controller;

import petshop.petshopapi.dto.PetDTO;
import petshop.petshopapi.entity.Pet;
import petshop.petshopapi.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping
    public ResponseEntity<PetDTO> criarPet(@RequestBody Pet pet, Authentication authentication) {
        PetDTO dto = petService.salvarComUsuario(pet, authentication);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/meus-pets")
    public ResponseEntity<List<PetDTO>> listarMeusPets(Authentication authentication) {
        List<PetDTO> lista = petService.listarPorDono(authentication);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDTO> buscarPet(@PathVariable Long id) {
        return petService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetDTO> atualizarPet(@PathVariable Long id,
                                               @RequestBody Pet pet,
                                               Authentication authentication) {
        PetDTO dto = petService.atualizarVerificandoDono(id, pet, authentication);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPet(@PathVariable Long id,
                                           Authentication authentication) { // <-- Adicionado Authentication
        // Chamando o novo método seguro do serviço
        petService.deletarVerificandoDono(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PetDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<PetDTO> lista = petService.listarPorDonoId(usuarioId);
        return ResponseEntity.ok(lista);
    }
}