package com.example.clpmonitor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "expedicao")
public class Expedicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "posicao")
    private Integer posicao;

    @Column(name = "numero_op")
    private Integer numeroOp;

    @Column(name = "status")
    private Integer status;

    @Column(name = "ultima_atualizacao")
    private String ultimaAtualizacao;

    @Column(name = "storage_id")
    private Short storageId;

    public Expedicao() {}

    public Expedicao(Integer posicao, Integer numeroOp, Integer status, Short storageId) {
        this.posicao = posicao;
        this.numeroOp = numeroOp;
        this.status = status;
        this.storageId = storageId;
    }

    public Expedicao(Integer posicao, Integer numeroOp, Integer status) {
        this.posicao = posicao;
        this.numeroOp = numeroOp;
        this.status = status;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    // Getters e setters para posicao
    public Integer getPosicao() {
        return posicao;
    }

    public void setPosicao(Integer posicao) {
        this.posicao = posicao;
    }

    // Getters e setters para numeroOp
    public Integer getNumeroOp() {
        return numeroOp;
    }

    public void setNumeroOp(Integer numeroOp) {
        this.numeroOp = numeroOp;
    }

    // Getters e setters para status
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    // Getters e setters para ultimaAtualizacao
    public String getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(String ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

    // Getters e setters para storageId
    public Short getStorageId() {
        return storageId;
    }

    public void setStorageId(Short storageId) {
        this.storageId = storageId;
    }

  
}
