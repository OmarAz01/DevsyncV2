package com.devsync.v2.controller;

import com.devsync.v2.dto.PostDTO;
import com.devsync.v2.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO newPost) {
        return postService.createPost(newPost);
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAll() {
        return postService.getAllPosts();
    }
}
