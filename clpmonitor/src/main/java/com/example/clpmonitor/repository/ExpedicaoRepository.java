package com.example.clpmonitor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Expedicao;

@Repository
public interface ExpedicaoRepository extends JpaRepository<Expedicao, Long> {

    @Query("SELECT e.posicao FROM Expedicao e WHERE e.status != 0 ORDER BY e.posicao ASC")
    List<Integer> findAllPosicoesOcupadas();

    Optional<Expedicao> findByPosicao(int posicao);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Expedicao e WHERE e.posicao = :posicao AND e.status != 0")
    boolean isPosicaoOcupada(Integer posicao);

    @Query("SELECT e.posicao FROM Expedicao e WHERE e.status = 0 ORDER BY e.posicao ASC")
    List<Integer> findPosicoesLivres();

    Optional<Expedicao> findByStorageIdAndPosicao(short storageId, int posicao);

    List<Expedicao> findByStorageId(short storageId);
}
