package com.devsync.v2.dto;

import com.devsync.v2.entity.ProfileDetailsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDetailsDTO {
    private String username;
    private String bio;
    private String imageUri;
    private String skills;
    private String userLink;
    private List<PostDTO> posts;

    public static ProfileDetailsDTO convertToDTO(ProfileDetailsEntity profileDetails) {
        return new ProfileDetailsDTO(
                profileDetails.getUser().getUsername(),
                profileDetails.getBio(),
                profileDetails.getImageUri(),
                profileDetails.getSkills(),
                profileDetails.getUserLink(),
                PostDTO.convertToDTOList(profileDetails.getUser().getPosts())
        );
    }
}
