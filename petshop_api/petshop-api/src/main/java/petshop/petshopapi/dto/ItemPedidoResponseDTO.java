package petshop.petshopapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoResponseDTO {
    private ProdutoResponseDTO produto;
    private int quantidade;
    private BigDecimal subtotal;
}