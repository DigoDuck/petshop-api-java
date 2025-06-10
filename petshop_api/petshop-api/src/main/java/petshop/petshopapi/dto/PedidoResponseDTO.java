package petshop.petshopapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import petshop.petshopapi.entity.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponseDTO {
    private Long id;
    private UsuarioResponseDTO cliente;
    private LocalDateTime data;
    private BigDecimal total;
    private StatusPedido status;
    private List<ItemPedidoResponseDTO> itens;
}