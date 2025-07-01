package com.example.clpmonitor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Pedido;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Query("SELECT COALESCE(MAX(p.id), 0) FROM Pedido p")
    int findMaxOrderProduction();
}

