package com.example.clpmonitor.dto;

import java.util.List;

public class PedidoDTO {
    private String tipo;
    private List<BlocoDTO> blocos;

    // Getters e Setters
    
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public List<BlocoDTO> getBlocos() {
        return blocos;
    }
    public void setBlocos(List<BlocoDTO> blocos) {
        this.blocos = blocos;
    }


    
}
