package petshop.petshopapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo; // Ex: Cachorro, Gato

    @Column(nullable = false)
    private String raca;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario dono;
}

