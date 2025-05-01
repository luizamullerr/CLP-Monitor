package com.example.clpmonitor.repository;

import com.example.clpmonitor.model.DbBlock;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DbBlockRepository extends JpaRepository<DbBlock, Long> {
    Optional<DbBlock> findByPosition(Short position);
}