package com.petshop.service;

import com.petshop.entity.Pet;
import com.petshop.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public List<Pet> listarTodos() {
        return petRepository.findAll();
    }

    public Optional<Pet> buscarPorId(Long id) {
        return petRepository.findById(id);
    }

    public Pet salvar(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet atualizar(Long id, Pet novoPet) {
        return petRepository.findById(id).map(pet -> {
            pet.setNome(novoPet.getNome());
            pet.setPorte(novoPet.getPorte());
            pet.setRaca(novoPet.getRaca());
            return petRepository.save(pet);
        }).orElseThrow(() -> new RuntimeException("Pet não encontrado"));
    }

    public void deletar(Long id) {
        petRepository.deleteById(id);
    }
}
