package com.example.clpmonitor.dto;

public class ExpedicaoDTO {
    private int id;
    private int posicaoExpedicao;
    private int orderNumber;
        
        // Getters e Setters

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getPosicaoExpedicao() {
        return posicaoExpedicao;
    }
    public void setPosicaoExpedicao(int posicaoExpedicao) {
        this.posicaoExpedicao = posicaoExpedicao;
    }
    public int getOrderNumber() {
        return orderNumber;
    }
    public void setOrderNumber(int orderNumber) {
        this.orderNumber = orderNumber;
    }

}