package petshop.petshopapi.dto;

import lombok.Data;
import petshop.petshopapi.entity.StatusAgendamento;
import java.time.LocalDateTime;

@Data
public class AgendamentoResponseDTO {
    private Long id;
    private PetDTO pet;
    private LocalDateTime dataHora;
    private String tipoServico;
    private StatusAgendamento status;
}