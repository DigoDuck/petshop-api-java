package petshop.petshopapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import petshop.petshopapi.dto.PedidoRequestDTO;
import petshop.petshopapi.dto.PedidoResponseDTO;
import petshop.petshopapi.entity.*;
import petshop.petshopapi.mapper.PedidoMapper;
import petshop.petshopapi.repository.PedidoRepository;
import petshop.petshopapi.repository.ProdutoRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService; // Usado para lógica de estoque

    // Injeção de dependência via construtor
    public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository, ProdutoService produtoService) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.produtoService = produtoService;
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO pedidoDTO, Usuario usuarioLogado) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuarioLogado);
        pedido.setData(LocalDateTime.now());
        pedido.setStatus(StatusPedido.PROCESSANDO);
        pedido.setItens(new ArrayList<>());

        BigDecimal totalPedido = BigDecimal.ZERO;

        if (pedidoDTO.getItens() == null || pedidoDTO.getItens().isEmpty()) {
            throw new IllegalArgumentException("O pedido deve conter pelo menos um item.");
        }

        for (var itemDTO : pedidoDTO.getItens()) {
            Produto produtoDoBanco = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDTO.getProdutoId()));

            if (produtoDoBanco.getQuantidade() < itemDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produtoDoBanco.getNome());
            }

            ItemPedido item = new ItemPedido();
            item.setProduto(produtoDoBanco);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setSubtotal(produtoDoBanco.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade())));
            item.setPedido(pedido);

            pedido.getItens().add(item);
            totalPedido = totalPedido.add(item.getSubtotal());

            produtoService.reduzirEstoque(produtoDoBanco.getId(), item.getQuantidade());
        }

        pedido.setTotal(totalPedido);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        // Converte a entidade salva para DTO antes de retornar
        return PedidoMapper.toDTO(pedidoSalvo);
    }

    public Page<PedidoResponseDTO> listarPorUsuarioId(Long usuarioId, Pageable pageable) {
        return pedidoRepository.findByUsuarioId(usuarioId, pageable)
                .map(PedidoMapper::toDTO);
    }

    public Optional<Pedido> buscarPorId(Long pedidoId) {
        return pedidoRepository.findById(pedidoId);
    }

    // Método separado para retornar o DTO para o cliente
    public Optional<PedidoResponseDTO> buscarPorIdDTO(Long pedidoId) {
        return pedidoRepository.findById(pedidoId).map(PedidoMapper::toDTO);
    }

    public Page<PedidoResponseDTO> listarTodos(Pageable pageable) {
        return pedidoRepository.findAll(pageable)
                .map(PedidoMapper::toDTO);
    }

    @Transactional
    public PedidoResponseDTO atualizarStatus(Long pedidoId, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + pedidoId));

        if (novoStatus == StatusPedido.CANCELADO && pedido.getStatus() != StatusPedido.CANCELADO) {
            for (ItemPedido item : pedido.getItens()) {
                Produto produto = item.getProduto();
                produto.setQuantidade(produto.getQuantidade() + item.getQuantidade());
                produtoRepository.save(produto);
            }
        }

        pedido.setStatus(novoStatus);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return PedidoMapper.toDTO(pedidoSalvo);
    }
}