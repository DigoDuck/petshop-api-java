package petshop.petshopapi.repository;

import petshop.petshopapi.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    Page<Agendamento> findByPetDonoId(Long donoId, Pageable pageable);
    List<Agendamento> findByPetId(Long petId);
}

