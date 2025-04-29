package com.example.clpmonitor.service;

import org.springframework.stereotype.Service;

import com.example.clpmonitor.model.DbBlock;

@Service
public class BlockService {

    public void updateBlock(DbBlock block) throws Exception {
        System.out.println("\nAtualizando bloco:");
        System.out.println("Posição: " + block.getPosition());
        System.out.println("Cor: " + block.getColor());
        System.out.println("Área (Estoque=1/Expedição=2): " + block.getStorageId());
        System.out.println("Ordem Produção: " + block.getProductionOrder());


    }
}
