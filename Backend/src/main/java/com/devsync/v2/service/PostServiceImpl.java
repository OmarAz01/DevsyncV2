package com.devsync.v2.service;

import com.devsync.v2.dto.PostDTO;
import com.devsync.v2.entity.PostEntity;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.PostRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepo postRepo;
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public ResponseEntity<List<PostDTO>> findByUsername(String username) {
        return null;
    }

    @Override
    @Transactional
    public ResponseEntity<PostDTO> createPost(PostDTO newPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            user = entityManager.merge(user);
            // User can only create three posts every 14 days to prevent spam
            // Check if the users third most recent post is older than 14 days
            LocalDateTime nowMinus14Days = LocalDateTime.now(ZoneOffset.UTC).minusDays(14);
            List<PostEntity> posts = user.getPosts();
            if (posts.size() >= 3) {
                posts.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
                if (posts.get(2).getCreatedAt().isAfter(nowMinus14Days)) {
                    return ResponseEntity.status(429).body(null);
                }
            }
            PostEntity postEntity = new PostEntity();
            postEntity.setUser(user);
            postEntity.setDescription(newPost.getDescription());
            postEntity.setTitle(newPost.getTitle());
            LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
            postEntity.setCreatedAt(now);
            postEntity.setSkills(newPost.getSkills());
            try {
                postRepo.save(postEntity);
                return ResponseEntity.status(201).body(PostDTO.convertToDTO(postEntity));
            }
            catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }
        }
        return ResponseEntity.status(403).body(null);
    }

    @Override
    public ResponseEntity<List<PostDTO>> getNewPosts(String lastPostDate) {
        List<PostEntity> posts;
        List<PostDTO> newPostDTOs = new ArrayList<>();
        LocalDateTime lastPostDateFormatted;
        System.out.println(lastPostDate);
        if (lastPostDate == null) {
            lastPostDateFormatted = LocalDateTime.now(ZoneOffset.UTC);
        }
        else {
            lastPostDateFormatted = LocalDateTime.parse(lastPostDate, DateTimeFormatter.ISO_DATE_TIME);
        }
        System.out.println(lastPostDateFormatted);
        try {
            posts = postRepo.getPostsBefore(lastPostDateFormatted);
            for (PostEntity post : posts) {
                newPostDTOs.add(PostDTO.convertToDTO(post));
            }
            if (newPostDTOs.isEmpty()) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.status(200).body(newPostDTOs);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
