package com.devsync.v2.service;

import com.devsync.v2.dto.PostDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PostService {

    ResponseEntity<List<PostDTO>> findByUsername(String username);

    ResponseEntity<PostDTO> createPost(PostDTO newPost);

    ResponseEntity<List<PostDTO>> getAllPosts();
}
