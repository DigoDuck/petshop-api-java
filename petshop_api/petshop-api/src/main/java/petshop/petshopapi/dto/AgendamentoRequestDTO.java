package petshop.petshopapi.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AgendamentoRequestDTO {

    @NotNull
    private Long petId;

    @Future
    private LocalDateTime dataHora;

    @NotBlank
    private String tipoServico;
}