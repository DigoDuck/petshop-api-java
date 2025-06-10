package petshop.petshopapi.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import petshop.petshopapi.dto.PetDTO;
import petshop.petshopapi.entity.Pet;
import petshop.petshopapi.entity.Usuario;
import petshop.petshopapi.repository.PetRepository;
import petshop.petshopapi.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final UsuarioRepository usuarioRepository;

    public PetService(PetRepository petRepository, UsuarioRepository usuarioRepository) {
        this.petRepository = petRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public PetDTO salvarComUsuario(Pet pet, Authentication authentication) {
        String emailUsuario = authentication.getName();
        Usuario dono = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        pet.setDono(dono);
        Pet petSalvo = petRepository.save(pet);
        return toDTO(petSalvo);
    }

    public List<PetDTO> listarPorDono(Authentication authentication) {
        String emailUsuario = authentication.getName();
        return petRepository.findByDonoEmail(emailUsuario).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<PetDTO> buscarPorId(Long id) {
        return petRepository.findById(id).map(this::toDTO);
    }

    public List<PetDTO> listarPorDonoId(Long usuarioId) {
        return petRepository.findByDonoId(usuarioId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PetDTO atualizarVerificandoDono(Long id, Pet petAtualizado, Authentication authentication) {
        Pet petExistente = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com o ID: " + id));

        verificarDono(petExistente, authentication);

        petExistente.setNome(petAtualizado.getNome());
        petExistente.setTipo(petAtualizado.getTipo());
        petExistente.setRaca(petAtualizado.getRaca());

        Pet petSalvo = petRepository.save(petExistente);
        return toDTO(petSalvo);
    }

    public void deletarVerificandoDono(Long id, Authentication authentication) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com o ID: " + id));

        verificarDono(pet, authentication);

        petRepository.delete(pet);
    }

    // Método privado para verificar se o usuário autenticado é o dono do pet
    private void verificarDono(Pet pet, Authentication authentication) {
        String emailUsuarioLogado = authentication.getName();
        if (!pet.getDono().getEmail().equals(emailUsuarioLogado)) {
            // Lança uma exceção que o Spring Security traduz para 403 Forbidden
            throw new AccessDeniedException("Acesso negado. Você não é o dono deste pet.");
        }
    }

    // Método de conversão para DTO
    private PetDTO toDTO(Pet pet) {
        return new PetDTO(
                pet.getId(),
                pet.getNome(),
                pet.getTipo(),
                pet.getRaca()
        );
    }
}