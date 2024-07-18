package com.devsync.v2.dto;

import com.devsync.v2.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String email;
    private String username;
    private String imageUri;
    private String role;
    private String bio;

    public static UserDTO convertToDTO(UserEntity user) {
        return new UserDTO(
                user.getUserId(),
                user.getEmail(),
                user.getUsername(),
                user.getImageUri(),
                user.getRole().toString(),
                user.getBio()
        );
    }
}

