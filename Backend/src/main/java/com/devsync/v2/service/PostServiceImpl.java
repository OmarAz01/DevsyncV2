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
        System.out.println("Creating post");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            user = entityManager.merge(user);
            PostEntity postEntity = new PostEntity();
            postEntity.setUser(user);
            postEntity.setDescription(newPost.getDescription());
            postEntity.setTitle(newPost.getTitle());
            Date date = new Date();
            postEntity.setCreatedAt(date.toString());
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
}
