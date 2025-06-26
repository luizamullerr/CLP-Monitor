package com.example.clpmonitor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.clpmonitor.model.Pedido;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    int findMaxOrderProduction();
}

