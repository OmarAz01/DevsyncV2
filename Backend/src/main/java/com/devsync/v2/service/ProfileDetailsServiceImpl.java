package com.devsync.v2.service;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.dto.UpdateBioDTO;
import com.devsync.v2.dto.UpdateSkillsDTO;
import com.devsync.v2.entity.ProfileDetails;
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

        Optional<UserEntity> user = userRepo.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        ProfileDetailsDTO profileDetailsDTO = ProfileDetailsDTO.convertToDTO(user.get().getProfileDetails());
        return ResponseEntity.status(200).body(profileDetailsDTO);
    }

    @Override
    public ResponseEntity<ProfileDetailsDTO> save(ProfileDetails profileDetails) {
        try {
            profileDetailsRepo.save(profileDetails);
            return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(profileDetails));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Override
    public ResponseEntity<ProfileDetailsDTO> updateSkills(String username, UpdateSkillsDTO newSkills) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            if (!user.getUsername().equals(username)) {
                return ResponseEntity.status(403).body(null);
            }
            ProfileDetails profileDetails1 = user.getProfileDetails();
            profileDetails1.setSkills(newSkills.getNewSkills());
            try {
                profileDetailsRepo.save(profileDetails1);
                return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(profileDetails1));
            }
            catch (Exception e) {
                return ResponseEntity.status(500).body(null);
            }
        }
        return ResponseEntity.status(403).body(null);
    }

    @Override
    public ResponseEntity<ProfileDetailsDTO> updateBio(String username, UpdateBioDTO newBio) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            if (!user.getUsername().equals(username)) {
                return ResponseEntity.status(403).body(null);
            }
            ProfileDetails profileDetails1 = user.getProfileDetails();
            profileDetails1.setBio(newBio.getNewBio());
            try {
                profileDetailsRepo.save(profileDetails1);
                return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(profileDetails1));
            }
            catch (Exception e) {
                return ResponseEntity.status(500).body(null);
            }
        }
        return ResponseEntity.status(403).body(null);
    }

    @Override
    public ResponseEntity<ProfileDetails> updateProfileDetails(Long userId, ProfileDetails profileDetails) {
        return null;
    }

    @Override
    public ResponseEntity<Long> deleteProfileDetails(Long userId) {
        return null;
    }
}
