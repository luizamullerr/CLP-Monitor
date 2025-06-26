package com.example.clpmonitor.dto;

import java.util.List;

public class BlocoDTO {
    private int andar;  // Adicione este campo que está sendo usado no controller
    private int corBloco; // Mude de String para int para compatibilidade
    private List<LaminaDTO> laminas;
    
    // Adicione getters/setters para o andar
    public int getAndar() {
        return andar;
    }
    public void setAndar(int andar) {
        this.andar = andar;
    }
    
    // Mude para int
    public int getCorBloco() {
        return corBloco;
    }
    public void setCorBloco(int corBloco) {
        this.corBloco = corBloco;
    }
    public List<LaminaDTO> getLaminas() {
        return laminas;
    }
    public void setLaminas(List<LaminaDTO> laminas) {
        this.laminas = laminas;
    }


    
}
