package com.example.clpmonitor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Expedicao;

@Repository
public interface ExpedicaoRepository extends JpaRepository<Expedicao, Long> {

    Optional<Expedicao> findByStorageIdAndPosicao(Short storageId, Integer posicao);

List<Expedicao> findByStorageId(Short storageId);

Optional<Expedicao> findByPosicao(Integer posicao);

@Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Expedicao e WHERE e.posicao = :posicao AND e.status != 0")
boolean isPosicaoOcupada(Integer posicao);

@Query("SELECT e.posicao FROM Expedicao e WHERE e.numeroOp > 0")
List<Integer> findAllPosicoesOcupadas();

@Query("SELECT e.posicao FROM Expedicao e WHERE e.status = 0 ORDER BY e.posicao ASC")
List<Integer> findPosicoesLivres();

}
