package com.petshop.repository;

import com.petshop.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {
}
