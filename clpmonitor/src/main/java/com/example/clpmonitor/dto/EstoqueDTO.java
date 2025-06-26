package com.example.clpmonitor.dto;

public class EstoqueDTO {
    private int id;
    private int posicaoEstoque;
    private int corBloco;
    
        // Getters e Setters

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getPosicaoEstoque() {
        return posicaoEstoque;
    }
    public void setPosicaoEstoque(int posicaoEstoque) {
        this.posicaoEstoque = posicaoEstoque;
    }
    public int getCorBloco() {
        return corBloco;
    }
    public void setCorBloco(int corBloco) {
        this.corBloco = corBloco;
    }
}
