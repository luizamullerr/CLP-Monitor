package com.example.clpmonitor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.DbBlock;

@Repository
public interface DbBlockRepository extends JpaRepository<DbBlock, Long> {
    // Busca pelo campo posicaoEstoque
    Optional<DbBlock> findByPosicaoEstoque(Integer posicaoEstoque);

    // Busca por storageId (Short)
    List<DbBlock> findByStorageId(Short storageId);

    // Busca por storageId e posicaoEstoque
    Optional<DbBlock> findByStorageIdAndPosicaoEstoque(Short storageId, Integer posicaoEstoque);

    // Busca por cor ordenada pela posição no estoque
    @Query("SELECT b FROM DbBlock b WHERE b.cor = :cor ORDER BY b.posicaoEstoque ASC")
    List<DbBlock> findByCorOrderByPosicaoEstoqueAsc(Integer cor);

    // Verifica se posição está ocupada (cor != 0)
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM DbBlock b WHERE b.posicaoEstoque = :posicao AND b.cor != 0")
    boolean isPosicaoOcupada(Integer posicao);

    // Busca todas as posições livres (cor = 0)
    @Query("SELECT b.posicaoEstoque FROM DbBlock b WHERE b.cor = 0 ORDER BY b.posicaoEstoque ASC")
    List<Integer> findPosicoesLivres();
}
