package com.devsync.v2.service;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.entity.ProfileDetails;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.ProfileDetailsRepo;
import com.devsync.v2.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ProfileDetails> updateProfileDetails(Long userId, ProfileDetails profileDetails) {
        return null;
    }

    @Override
    public ResponseEntity<Long> deleteProfileDetails(Long userId) {
        return null;
    }
}
