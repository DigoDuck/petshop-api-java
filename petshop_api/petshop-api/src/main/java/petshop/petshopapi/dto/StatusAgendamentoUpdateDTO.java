package petshop.petshopapi.dto;

import lombok.Data;
import petshop.petshopapi.entity.StatusAgendamento;

@Data
public class StatusAgendamentoUpdateDTO {

    private StatusAgendamento novoStatus;
}