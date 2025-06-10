package petshop.petshopapi.dto;

public record PetDTO(
        Long id,
        String nome,
        String tipo,
        String raca
) {}
