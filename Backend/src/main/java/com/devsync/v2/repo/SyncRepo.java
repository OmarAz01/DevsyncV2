package com.devsync.v2.repo;

import com.devsync.v2.entity.SyncEntity;
import com.devsync.v2.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyncRepo extends JpaRepository<SyncEntity, Long> {

    @Query("SELECT s FROM SyncEntity s WHERE s.sender = ?1 ORDER BY s.dateOfSync DESC")
    List<SyncEntity> findBySender(UserEntity sender);

    @Query("SELECT s FROM SyncEntity s WHERE (s.recipient = ?1) AND (s.status = 'Pending' OR s.status = 'Response') ORDER BY s.dateOfSync DESC")
    List<SyncEntity> findByRecipient(UserEntity recipient);



}
