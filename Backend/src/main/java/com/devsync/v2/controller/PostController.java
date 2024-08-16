package com.devsync.v2.controller;

import com.devsync.v2.dto.PostDTO;
import com.devsync.v2.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;
    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO newPost) {
        return postService.createPost(newPost);
    }
}
