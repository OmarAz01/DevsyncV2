package com.devsync.v2.repo;

import com.devsync.v2.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<PostEntity, Long> {

    @Query("SELECT p from PostEntity p WHERE p.createdAt < :lastPostDate ORDER BY p.createdAt DESC LIMIT 10")
    List<PostEntity> getPostsBefore(LocalDateTime lastPostDate);
}
