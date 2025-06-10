package petshop.petshopapi.dto;

import lombok.Data; // Importe lombok.Data
import lombok.AllArgsConstructor; // Importe lombok.AllArgsConstructor
import lombok.NoArgsConstructor; // É uma boa prática ter também o NoArgsConstructor

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String jwt;
}