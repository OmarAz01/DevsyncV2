package com.devsync.v2.service;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.entity.ProfileDetailsEntity;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.ProfileDetailsRepo;
import com.devsync.v2.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileDetailsServiceImpl implements ProfileDetailsService {
    private final ProfileDetailsRepo profileDetailsRepo;
    private final UserRepo userRepo;
    @Override
    public ResponseEntity<ProfileDetailsDTO> findByUsername(String username) {

        // This is a special case where the user is requesting their own profile
        if (username.equals("myprofile")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserEntity) {
                UserEntity user = (UserEntity) principal;
                ProfileDetailsEntity profileDetails = user.getProfileDetails();
                return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(profileDetails));
            }
            return ResponseEntity.status(403).body(null);
        }

        Optional<UserEntity> user = userRepo.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        ProfileDetailsDTO profileDetailsDTO = ProfileDetailsDTO.convertToDTO(user.get().getProfileDetails());
        return ResponseEntity.status(200).body(profileDetailsDTO);
    }

    @Override
    public ResponseEntity<ProfileDetailsDTO> save(ProfileDetailsEntity profileDetails) {
        try {
            profileDetailsRepo.save(profileDetails);
            return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(profileDetails));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Override
    public ResponseEntity<ProfileDetailsDTO> updateProfileDetails(String username, ProfileDetailsDTO updatedProfile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            ProfileDetailsEntity updatedProfileDetails = user.getProfileDetails();
            updatedProfileDetails.setBio(updatedProfile.getBio());
            updatedProfileDetails.setSkills(updatedProfile.getSkills());
            updatedProfileDetails.setUserLink(updatedProfile.getUserLink());
            try {
                profileDetailsRepo.save(updatedProfileDetails);
                return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(updatedProfileDetails));
            }
            catch (Exception e) {
                return ResponseEntity.status(500).body(null);
            }
        }
        return ResponseEntity.status(403).body(null);
    }

    @Override
    public ResponseEntity<Long> deleteProfileDetails(String username, ProfileDetailsDTO profileDetailsDTO) {
        return null;
    }

}
