package com.petshop.domain;

import jakarta.persistence.*;

@Entity
public class Pet {

    @Id
    @generatedValue(strategy = GenerationType.INDENTITY)
    private Long id;

    private String nome;
    private String porte;
    private String raca;

    public Pet() {
    }

    public Pet(Long id, String nome, String tipo, String raca) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.raca = raca;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id
    }
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }
}