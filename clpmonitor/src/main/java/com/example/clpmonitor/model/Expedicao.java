package com.example.clpmonitor.model;

import jakarta.persistence.*;

@Entity
@Table(name = "expedicao")
public class Expedicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "posicao", unique = true)
    private Integer posicao;

    @Column(name = "numero_op")
    private Integer numeroOp; // Número da Ordem de Produção

    @Column(name = "status")
    private Integer status; // 0-LIVRE, 1-OCUPADO

    @Column(name = "ultima_atualizacao")
    private String ultimaAtualizacao;

    // Construtores
    public Expedicao() {
    }

    public Expedicao(Integer posicao, Integer numeroOp, Integer status) {
        this.posicao = posicao;
        this.numeroOp = numeroOp;
        this.status = status;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosicao() {
        return posicao;
    }

    public void setPosicao(Integer posicao) {
        this.posicao = posicao;
    }

    public Integer getNumeroOp() {
        return numeroOp;
    }

    public void setNumeroOp(Integer numeroOp) {
        this.numeroOp = numeroOp;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(String ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }
}