
package com.example.clpmonitor.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Estoque;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    // Busca posições por cor ordenadas
    @Query("SELECT e FROM Estoque e WHERE e.cor = :cor ORDER BY e.posicaoEstoque ASC")
    List<Estoque> findByCorOrderByPosicaoEstoqueAsc(Integer cor);

    // Busca posição específica
    Estoque findByPosicaoEstoque(Integer posicao);

    // Verifica se posição está ocupada
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Estoque e WHERE e.posicaoEstoque = :posicao AND e.cor != 0")
    boolean isPosicaoOcupada(Integer posicao);

    // Busca todas as posições livres (cor = 0)
    @Query("SELECT e.posicaoEstoque FROM Estoque e WHERE e.cor = 0 ORDER BY e.posicaoEstoque ASC")
    List<Integer> findPosicoesLivres();

}