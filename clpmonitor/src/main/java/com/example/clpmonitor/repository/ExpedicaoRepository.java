
package com.example.clpmonitor.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Expedicao;

@Repository
public interface ExpedicaoRepository extends JpaRepository<Expedicao, Long> {

    // Busca todas as posições ocupadas (status != 0)
    @Query("SELECT e.posicao FROM Expedicao e WHERE e.status != 0 ORDER BY e.posicao ASC")
    List<Integer> findAllPosicoesOcupadas();

    // Busca posição específica
    Expedicao findByPosicao(Integer posicao);

    // Verifica se posição está ocupada
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Expedicao e WHERE e.posicao = :posicao AND e.status != 0")
    boolean isPosicaoOcupada(Integer posicao);

    // Busca todas as posições livres (status = 0)
    @Query("SELECT e.posicao FROM Expedicao e WHERE e.status = 0 ORDER BY e.posicao ASC")
    List<Integer> findPosicoesLivres();
}