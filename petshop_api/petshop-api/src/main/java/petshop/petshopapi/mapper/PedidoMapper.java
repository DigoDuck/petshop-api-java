package petshop.petshopapi.mapper;

import petshop.petshopapi.dto.ItemPedidoResponseDTO;
import petshop.petshopapi.dto.PedidoResponseDTO;
import petshop.petshopapi.dto.ProdutoResponseDTO;
import petshop.petshopapi.dto.UsuarioResponseDTO;
import petshop.petshopapi.entity.ItemPedido;
import petshop.petshopapi.entity.Pedido;

import java.util.List; // <-- IMPORT ADICIONADO AQUI
import java.util.stream.Collectors;

public class PedidoMapper {

    public static PedidoResponseDTO toDTO(Pedido pedido) {
        if (pedido == null) {
            return null;
        }

        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(
                pedido.getUsuario().getId(),
                pedido.getUsuario().getNome(),
                pedido.getUsuario().getEmail()
        );

        // O método .stream() agora será reconhecido por causa do import
        List<ItemPedidoResponseDTO> itensDTO = pedido.getItens().stream()
                .map(PedidoMapper::toDTO)
                .collect(Collectors.toList());

        PedidoResponseDTO dto = new PedidoResponseDTO();
        // Os métodos 'set' agora existem por causa da anotação @Data
        dto.setId(pedido.getId());
        dto.setCliente(usuarioDTO);
        dto.setData(pedido.getData());
        dto.setTotal(pedido.getTotal());
        dto.setStatus(pedido.getStatus());
        dto.setItens(itensDTO);

        return dto;
    }

    public static ItemPedidoResponseDTO toDTO(ItemPedido itemPedido) {
        ProdutoResponseDTO produtoDTO = new ProdutoResponseDTO(
                itemPedido.getProduto().getId(),
                itemPedido.getProduto().getNome(),
                itemPedido.getProduto().getPreco()
        );

        return new ItemPedidoResponseDTO(
                produtoDTO,
                itemPedido.getQuantidade(),
                itemPedido.getSubtotal()
        );
    }
}