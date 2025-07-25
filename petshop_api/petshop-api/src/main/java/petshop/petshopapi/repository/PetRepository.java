package petshop.petshopapi.repository;

import petshop.petshopapi.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByDonoEmail(String email);
    List<Pet> findByDonoId(Long usuarioId);
}
