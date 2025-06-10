package petshop.petshopapi.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String senha;
}