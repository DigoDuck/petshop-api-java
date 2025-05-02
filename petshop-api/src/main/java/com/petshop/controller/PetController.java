package com.petshop.controller;

import com.petshop.domain.Pet;
import com.petshop.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping
    public List<Pet> listar() {
        return petRepository.findAll();
    }

    @PostMapping
    public Pet salvar(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }
}
