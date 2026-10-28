package com.pict.alumuniconnect.repository;

import com.pict.alumuniconnect.entity.Connection;
import com.pict.alumuniconnect.entity.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE " +
           "(c.sender.id = :user1Id AND c.receiver.id = :user2Id) OR " +
           "(c.sender.id = :user2Id AND c.receiver.id = :user1Id)")
    Optional<Connection> findBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT c FROM Connection c WHERE " +
           "c.sender.id = :alumniId OR c.receiver.id = :alumniId " +
           "ORDER BY c.createdAt DESC")
    List<Connection> findByAlumniId(@Param("alumniId") Long alumniId);

    @Query("SELECT c FROM Connection c WHERE " +
           "(c.sender.id = :alumniId OR c.receiver.id = :alumniId) " +
           "AND c.status = :status")
    List<Connection> findByAlumniIdAndStatus(
            @Param("alumniId") Long alumniId,
            @Param("status") ConnectionStatus status
    );
}

