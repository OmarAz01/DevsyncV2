package com.devsync.v2.service;

import com.devsync.v2.dto.PostDTO;
import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.entity.PostEntity;
import com.devsync.v2.entity.ProfileDetailsEntity;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.ProfileDetailsRepo;
import com.devsync.v2.repo.UserRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileDetailsServiceImpl implements ProfileDetailsService {
    private final ProfileDetailsRepo profileDetailsRepo;
    private final UserRepo userRepo;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ResponseEntity<ProfileDetailsDTO> findByUsername(String username) {

        // This is a special case where the user is requesting their own profile
        if (username.equals("myprofile")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserEntity) {
                UserEntity user = (UserEntity) principal;
                user = userRepo.findByUsername(user.getUsername()).get();
                return ResponseEntity.ok(createProfileDetailsDTO(user));
            }
            return ResponseEntity.status(403).body(null);
        }

        Optional<UserEntity> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(createProfileDetailsDTO(userOpt.get()));
    }

    private ProfileDetailsDTO createProfileDetailsDTO(UserEntity user) {
        ProfileDetailsEntity profileDetails = user.getProfileDetails();
        List<PostEntity> posts = user.getPosts();
        posts.sort(Comparator.comparing(PostEntity::getCreatedAt).reversed());

        return new ProfileDetailsDTO(
                user.getUsername(),
                profileDetails.getBio(),
                profileDetails.getSkills(),
                profileDetails.getUserLink(),
                PostDTO.convertToDTOList(posts)
        );
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

    @Transactional
    @Override
    public ResponseEntity<ProfileDetailsDTO> updateProfileDetails(String username, ProfileDetailsDTO updatedProfile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            user = entityManager.merge(user);
            ProfileDetailsEntity updatedProfileDetails = user.getProfileDetails();
            updatedProfileDetails.setBio(updatedProfile.getBio());
            updatedProfileDetails.setSkills(updatedProfile.getSkills());
            if (updatedProfile.getUserLink() != null) {
                updatedProfileDetails.setUserLink(updatedProfile.getUserLink());
            }

            try {
                profileDetailsRepo.save(updatedProfileDetails);
                return ResponseEntity.status(200).body(ProfileDetailsDTO.convertToDTO(updatedProfileDetails));
            }
            catch (Exception e) {
                System.out.println(e);
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
