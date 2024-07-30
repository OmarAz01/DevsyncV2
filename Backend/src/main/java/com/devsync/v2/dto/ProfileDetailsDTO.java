package com.devsync.v2.dto;

import com.devsync.v2.entity.ProfileDetails;
import com.devsync.v2.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDetailsDTO {
    private String username;
    private String email;
    private String bio;
    private String imageUri;
    private String skills;

    public static ProfileDetailsDTO convertToDTO(ProfileDetails profileDetails) {
        return new ProfileDetailsDTO(
                profileDetails.getUser().getUsername(),
                profileDetails.getUser().getEmail(),
                profileDetails.getBio(),
                profileDetails.getImageUri(),
                profileDetails.getSkills()
        );
    }
}
