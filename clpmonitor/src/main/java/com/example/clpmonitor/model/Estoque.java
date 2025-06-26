package com.example.clpmonitor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "estoque")
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "posicao_estoque", unique = true)
    private Integer posicaoEstoque;

    @Column(name = "cor")
    private Integer cor; // 0-LIVRE, 1-PRETO, 2-VERMELHO, 3-AZUL

    @Column(name = "ultima_atualizacao")
    private String ultimaAtualizacao;

    // Construtores
    public Estoque() {
    }

    public Estoque(Integer posicaoEstoque, Integer cor) {
        this.posicaoEstoque = posicaoEstoque;
        this.cor = cor;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosicaoEstoque() {
        return posicaoEstoque;
    }

    public void setPosicaoEstoque(Integer posicaoEstoque) {
        this.posicaoEstoque = posicaoEstoque;
    }

    public Integer getCor() {
        return cor;
    }

    public void setCor(Integer cor) {
        this.cor = cor;
    }

    public String getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(String ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

}