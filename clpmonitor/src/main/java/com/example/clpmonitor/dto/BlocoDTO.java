package com.example.clpmonitor.dto;

import java.util.List;

public class BlocoDTO {
    private int andar;
    private int posicaoEstoque;
    private int cor;
    private List<LaminaDTO> laminas;
    
    // Getters e Setters
    
    public int getAndar() {
        return andar;
    }

    public void setAndar(int andar) {
        this.andar = andar;
    }

    public int getPosicaoEstoque() {
        return posicaoEstoque;
    }

    public void setPosicaoEstoque(int posicaoEstoque) {
        this.posicaoEstoque = posicaoEstoque;
    }
    public int getCor() {
        return cor;
    }

    public void setCor(int cor) {
        this.cor = cor;
    }
   
    public List<LaminaDTO> getLaminas() {
        return laminas;
    }
    public void setLaminas(List<LaminaDTO> laminas) {
        this.laminas = laminas;
    }

    


    
}
