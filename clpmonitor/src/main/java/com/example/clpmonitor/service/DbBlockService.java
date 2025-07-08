package com.example.clpmonitor.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.clpmonitor.model.DbBlock;
import com.example.clpmonitor.repository.DbBlockRepository;


@Service
public class DbBlockService {
    
    private static final int TOTAL_POSITIONS = 28;
    private static final short DEFAULT_COLOR = 0; // Cor padrão
    private static final short DEFAULT_TYPE = 2;   // Tipo padrão (estoque)

    @Autowired
    private DbBlockRepository blockRepository;
    
    

    // Inicializa as 28 posições se não existirem
    

    public DbBlock cadastrarBloco(DbBlock newBlock) {
        Optional<DbBlock> existingBlockOpt = blockRepository.findByPosicaoEstoque(newBlock.getPosicaoEstoque());
        DbBlock savedBlock;
    
        if (existingBlockOpt.isPresent()) {
            DbBlock existingBlock = existingBlockOpt.get();
            existingBlock.setCor(newBlock.getCor());
            existingBlock.setStorageId(newBlock.getStorageId());
            existingBlock.setProductionOrder(newBlock.getProductionOrder());
            savedBlock = blockRepository.save(existingBlock);
        } else {
            savedBlock = blockRepository.save(newBlock);
        }
    
        // Atualiza ou cria entrada no estoque
        int posicaoEstoque = savedBlock.getPosicaoEstoque(); // já é short, só promove para int
        int cor = savedBlock.getCor(); // idem
        String ultimaAtualizacao = java.time.LocalDateTime.now().toString();
    
        DbBlock dbBlock = blockRepository.findByPosicaoEstoque(posicaoEstoque)
            .orElse(new DbBlock(DEFAULT_TYPE, DEFAULT_COLOR, DEFAULT_TYPE, cor)); // construtor cobre posição e cor
    
            dbBlock.setCor(cor);
            dbBlock.setUltimaAtualizacao(ultimaAtualizacao);
        
        blockRepository.save(dbBlock);
    
        return savedBlock;
    }
    
    
    
    public List<DbBlock> listarBlocos() {
        return blockRepository.findAll();
    }
   

    public DbBlock buscarPorId(Long id) {
        return blockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bloco não encontrado!"));
    }

    public void deletarPorId(Long id) {
        blockRepository.deleteById(id);
    }

    public List<DbBlock> listarBlocosOrdenados() {
        List<DbBlock> blocos = new ArrayList<>();
    
        for (int i = 1; i <= TOTAL_POSITIONS; i++) {
            DbBlock block = blockRepository.findByPosicaoEstoque(Integer.valueOf(i))
                .orElse(new DbBlock(i, DEFAULT_COLOR, DEFAULT_TYPE, null));
            blocos.add(block);
        }
    
        return blocos;
    }

    // Método específico para retornar os blocos organizados em grid (6 colunas)
    public List<List<DbBlock>> listarBlocosEmGrid() {
        List<DbBlock> blocosOrdenados = this.listarBlocosOrdenados();
        List<List<DbBlock>> grid = new ArrayList<>();
        
        int colunas = 6;
        for (int i = 0; i < blocosOrdenados.size(); i += colunas) {
            int fim = Math.min(i + colunas, blocosOrdenados.size());
            grid.add(blocosOrdenados.subList(i, fim));
        }
        
        return grid;
    }

}