package com.devsync.v2.dto;

import com.devsync.v2.entity.PostEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String description;
    private String skills;
    private String createdAt;
    private String username;
    private String imageUri;

    public static PostDTO convertToDTO(PostEntity post) {
        return new PostDTO(
                post.getPostId(),
                post.getTitle(),
                post.getDescription(),
                post.getSkills(),
                post.getCreatedAt().toString(),
                post.getUser().getUsername(),
                post.getUser().getProfileDetails().getImageUri()
        );
    }
}
