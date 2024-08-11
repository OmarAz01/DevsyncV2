package com.devsync.v2.service;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.dto.UpdateBioDTO;
import com.devsync.v2.dto.UpdateSkillsDTO;
import com.devsync.v2.dto.UpdateUserLinkDTO;
import com.devsync.v2.entity.ProfileDetails;
import org.springframework.http.ResponseEntity;

public interface ProfileDetailsService {
    ResponseEntity<ProfileDetailsDTO> findByUsername(String username);

    ResponseEntity<ProfileDetailsDTO> save(ProfileDetails profileDetails);

    ResponseEntity<ProfileDetailsDTO> updateProfileDetails(String username, ProfileDetailsDTO updatedProfile);

    ResponseEntity<Long> deleteProfileDetails(String username, ProfileDetailsDTO profileDetailsDTO);

}
