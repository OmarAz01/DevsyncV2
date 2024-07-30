package com.devsync.v2.service;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.entity.ProfileDetails;
import org.springframework.http.ResponseEntity;

public interface ProfileDetailsService {
    ResponseEntity<ProfileDetailsDTO> findByUsername(String username);

    ResponseEntity<ProfileDetailsDTO> save(ProfileDetails profileDetails);

    ResponseEntity<ProfileDetails> updateProfileDetails(Long userId, ProfileDetails profileDetails);

    ResponseEntity<Long> deleteProfileDetails(Long userId);
}
