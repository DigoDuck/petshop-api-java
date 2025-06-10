package petshop.petshopapi.dto;

import petshop.petshopapi.entity.StatusPedido;

public class StatusUpdateRequestDTO {
    private StatusPedido novoStatus;

    public StatusPedido getNovoStatus() { return novoStatus; }
    public void setNovoStatus(StatusPedido novoStatus) { this.novoStatus = novoStatus; }
}