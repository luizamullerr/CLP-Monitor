package com.example.clpmonitor.service;

import java.util.ArrayList;
import java.util.Comparator;
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
        Optional<DbBlock> existingBlockOpt = blockRepository.findByPosition(newBlock.getPosition());
    
        if (existingBlockOpt.isPresent()) {
            DbBlock existingBlock = existingBlockOpt.get();
            existingBlock.setColor(newBlock.getColor());
            existingBlock.setStorageId(newBlock.getStorageId());
            existingBlock.setProductionOrder(newBlock.getProductionOrder());
            return blockRepository.save(existingBlock);
        }
        return blockRepository.save(newBlock);
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
            DbBlock block = blockRepository.findByPosition((short) i)
                    .orElse(new DbBlock((short) i, DEFAULT_COLOR, DEFAULT_TYPE, null));
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
    // Métodos específicos para expedição
    public List<DbBlock> listarExpedicaoOrdenados() {
        List<DbBlock> blocos = new ArrayList<>();
        
        // Considerando que as posições de expedição são P1-P12
        for (int i = 1; i <= 12; i++) {
            DbBlock block = blockRepository.findByPosition((short)i)
                    .orElse(new DbBlock((short)i, DEFAULT_COLOR, DEFAULT_TYPE, null));
            blocos.add(block);
        }
        
        return blocos;
    }

    public List<List<DbBlock>> listarExpedicaoEmGrid() {
        List<DbBlock> blocosOrdenados = this.listarExpedicaoOrdenados();
        List<List<DbBlock>> grid = new ArrayList<>();
        
        int colunas = 4; // Grid de 4 colunas para expedição
        for (int i = 0; i < blocosOrdenados.size(); i += colunas) {
            int fim = Math.min(i + colunas, blocosOrdenados.size());
            grid.add(blocosOrdenados.subList(i, fim));
        }
        
        return grid;
    }
    public List<DbBlock> listarBlocosPorStorageId(short storageId) {
        List<DbBlock> blocos = blockRepository.findByStorageId(storageId);
    
        // Preenche as posições vazias se quiser garantir a grade completa, exemplo de 1 a 12 (3x4)
        for (int i = 1; i <= 12; i++) {
            final short pos = (short) i;
            boolean exists = blocos.stream().anyMatch(b -> b.getPosition() == pos);
            if (!exists) {
                blocos.add(new DbBlock(pos, DEFAULT_COLOR, DEFAULT_TYPE, storageId));
            }
        }
    
        blocos.sort(Comparator.comparing(DbBlock::getPosition)); // ordenar por posição
        return blocos;
    }

}
