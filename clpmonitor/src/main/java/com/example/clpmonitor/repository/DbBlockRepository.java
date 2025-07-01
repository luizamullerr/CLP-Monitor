package com.example.clpmonitor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.clpmonitor.model.DbBlock;

public interface DbBlockRepository extends JpaRepository<DbBlock, Long> {

    Optional<DbBlock> findByPosition(Short position);

    List<DbBlock> findByStorageId(short storageId);

    Optional<DbBlock> findByStorageIdAndPosition(short storageId, short position);
    
    
    
}


