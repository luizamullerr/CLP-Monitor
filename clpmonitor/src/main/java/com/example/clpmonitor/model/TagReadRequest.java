package com.example.clpmonitor.model;

public class TagReadRequest {
    private String ip;
    private int porta = 102;
    private int db;
    private int offset;
    private Integer bitNumber; // opcional
    private Integer size;      // opcional
    private String tipo;

    
    public String getIp() {
        return ip;
    }
    public void setIp(String ip) {
        this.ip = ip;
    }
    public int getPorta() {
        return porta;
    }
    public void setPorta(int porta) {
        this.porta = porta;
    }
    public int getDb() {
        return db;
    }
    public void setDb(int db) {
        this.db = db;
    }
    public int getOffset() {
        return offset;
    }
    public void setOffset(int offset) {
        this.offset = offset;
    }
    public Integer getBitNumber() {
        return bitNumber;
    }
    public void setBitNumber(Integer bitNumber) {
        this.bitNumber = bitNumber;
    }
    public Integer getSize() {
        return size;
    }
    public void setSize(Integer size) {
        this.size = size;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    // Getters e setters
}
