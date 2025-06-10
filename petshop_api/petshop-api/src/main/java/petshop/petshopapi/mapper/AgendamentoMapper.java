package petshop.petshopapi.mapper;

import petshop.petshopapi.dto.AgendamentoResponseDTO;
import petshop.petshopapi.dto.PetDTO;
import petshop.petshopapi.entity.Agendamento;

public class AgendamentoMapper {
    public static AgendamentoResponseDTO toDTO(Agendamento agendamento) {
        if (agendamento == null) return null;

        PetDTO petDTO = new PetDTO(
                agendamento.getPet().getId(),
                agendamento.getPet().getNome(),
                agendamento.getPet().getTipo(),
                agendamento.getPet().getRaca()
        );

        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.setId(agendamento.getId());
        dto.setPet(petDTO);
        dto.setDataHora(agendamento.getDataHora());
        dto.setTipoServico(agendamento.getTipoServico());
        dto.setStatus(agendamento.getStatus());

        return dto;
    }
}