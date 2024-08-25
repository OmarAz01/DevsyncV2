package com.devsync.v2.dto;

import com.devsync.v2.entity.PostEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public static PostDTO convertToDTO(PostEntity post) {
        return new PostDTO(
                post.getPostId(),
                post.getTitle(),
                post.getDescription(),
                post.getSkills(),
                post.getCreatedAt().toString(),
                post.getUser().getUsername()
        );
    }

    public static List<PostDTO> convertToDTOList(List<PostEntity> posts) {
        List<PostDTO> postDTOs = new ArrayList<>();
        for (PostEntity post : posts) {
            postDTOs.add(convertToDTO(post));
        }
        return postDTOs;
    }
}
