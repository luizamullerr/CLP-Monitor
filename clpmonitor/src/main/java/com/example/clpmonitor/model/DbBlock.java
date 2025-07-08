package com.example.clpmonitor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "db_block")
public class DbBlock {

    public DbBlock() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "storageId", nullable = false)
    private Short storageId;

    @Column(name = "productionOrder", nullable = true)
    private Short productionOrder;

    
    @Column(name = "posicao_estoque", unique = true)
   
    private Integer posicaoEstoque;

    @Column(name = "cor")
    private Integer cor; // 0-LIVRE, 1-PRETO, 2-VERMELHO, 3-AZUL

    @Column(name = "ultima_atualizacao")
    private String ultimaAtualizacao;

    // ✅ Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getStorageId() {
        return storageId;
    }

    public void setStorageId(Short storageId) {
        this.storageId = storageId;
    }

    public Short getProductionOrder() {
        return productionOrder;
    }

    public void setProductionOrder(Short productionOrder) {
        this.productionOrder = productionOrder;
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

    // ✅ Construtores adicionais

    public DbBlock(Long id, Short storageId, Short productionOrder, Integer posicaoEstoque, Integer cor,
            String ultimaAtualizacao) {
        this.id = id;
        this.storageId = storageId;
        this.productionOrder = productionOrder;
        this.posicaoEstoque = posicaoEstoque;
        this.cor = cor;
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

   
    public DbBlock(short i, short defaultColor, short defaultType, Object object) {
        
    }

    public DbBlock(Integer posicaoEstoque, Short cor, Short storageId, Object outro) {
        this.posicaoEstoque = posicaoEstoque;
        this.cor = cor != null ? cor.intValue() : null; // ou ajuste conforme seu tipo cor é Integer
        this.storageId = storageId;
        // você pode armazenar ou ignorar 'outro' conforme precisar
    }
}
