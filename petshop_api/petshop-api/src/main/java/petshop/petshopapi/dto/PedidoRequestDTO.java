package petshop.petshopapi.dto;

import java.util.List;

public class PedidoRequestDTO {
    private List<ItemPedidoRequestDTO> itens;

    public List<ItemPedidoRequestDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoRequestDTO> itens) { this.itens = itens; }
}