package com.example.clpmonitor.dto;

import java.sql.Timestamp;
import java.util.List;

public class PedidoDTO {
    private String tipo;
    private String ipClp;
    private String statusOrderProduction;
    private Timestamp timeStamp;
    private List<BlocoDTO> blocos;

    // Getters e Setters
    
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public String getIpClp() {
        return ipClp;
    }

    public void setIpClp(String ipClp) {
        this.ipClp = ipClp;
    }

    public String getStatusOrderProduction() {
        return statusOrderProduction;
    }

    public void setStatusOrderProduction(String statusOrderProduction) {
        this.statusOrderProduction = statusOrderProduction;
    }

    public Timestamp getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Timestamp timeStamp) {
        this.timeStamp = timeStamp;
    }
    public List<BlocoDTO> getBlocos() {
        return blocos;
    }
    public void setBlocos(List<BlocoDTO> blocos) {
        this.blocos = blocos;
    }


    
}
