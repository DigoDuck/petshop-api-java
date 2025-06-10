package petshop.petshopapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import petshop.petshopapi.dto.AgendamentoRequestDTO;
import petshop.petshopapi.dto.AgendamentoResponseDTO;
import petshop.petshopapi.entity.*;
import petshop.petshopapi.mapper.AgendamentoMapper;
import petshop.petshopapi.repository.AgendamentoRepository;
import petshop.petshopapi.repository.PetRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PetRepository petRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, PetRepository petRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.petRepository = petRepository;
    }

    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto, Usuario usuarioLogado) {
        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com o ID: " + dto.getPetId()));

        if (!pet.getDono().getId().equals(usuarioLogado.getId())) {
            throw new SecurityException("Este pet não pertence ao usuário logado.");
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setPet(pet);
        agendamento.setDataHora(dto.getDataHora());
        agendamento.setTipoServico(dto.getTipoServico());
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return AgendamentoMapper.toDTO(salvo);
    }

    public Page<AgendamentoResponseDTO> listarPorDonoDePet(Long donoId, Pageable pageable) {
        return agendamentoRepository.findByPetDonoId(donoId, pageable)
                .map(AgendamentoMapper::toDTO);
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }

    public Optional<AgendamentoResponseDTO> buscarPorIdDTO(Long id) {
        return this.buscarPorId(id).map(AgendamentoMapper::toDTO);
    }

    @Transactional
    public AgendamentoResponseDTO atualizarStatus(Long id, StatusAgendamento novoStatus) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com o id: " + id));

        agendamento.setStatus(novoStatus);
        Agendamento salvo = agendamentoRepository.save(agendamento);
        return AgendamentoMapper.toDTO(salvo);
    }

    public Page<AgendamentoResponseDTO> listarTodos(Pageable pageable) {
        return agendamentoRepository.findAll(pageable)
                .map(AgendamentoMapper::toDTO);
    }

    public List<AgendamentoResponseDTO> listarPorPetId(Long petId) {
        return agendamentoRepository.findByPetId(petId).stream()
                .map(AgendamentoMapper::toDTO)
                .collect(Collectors.toList());
    }
}