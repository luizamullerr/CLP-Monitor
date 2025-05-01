package com.example.clpmonitor.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.clpmonitor.model.DbBlock;
import com.example.clpmonitor.repository.DbBlockRepository;

@Service
public class DbBlockService {
    @Autowired
    private DbBlockRepository blockRepository;

    public DbBlock cadastrarBloco(DbBlock newBlock) {
        Optional<DbBlock> existingBlockOpt = blockRepository.findByPosition(newBlock.getPosition());
    
        if (existingBlockOpt.isPresent()) {
            DbBlock existingBlock = existingBlockOpt.get();
            // Atualiza os campos necessários
            existingBlock.setColor(newBlock.getColor());
            existingBlock.setStorageId(newBlock.getStorageId());
            existingBlock.setProductionOrder(newBlock.getProductionOrder());
            return blockRepository.save(existingBlock);
        } else {
            return blockRepository.save(newBlock);
        }
    }

    public List<DbBlock> listarBlocos()
    {
        return blockRepository.findAll();
    }

    public DbBlock buscarPorId(Long id)
    {
        Optional<DbBlock> bloco = blockRepository.findById(id);
        return bloco.orElseThrow(() -> new RuntimeException("Bloco não encontrado!"));
    }

    public void deletarPorId(Long id)
    {
        blockRepository.deleteById(id);
    }



}