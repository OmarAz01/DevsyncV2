package com.devsync.v2.controller;

import com.devsync.v2.dto.*;
import com.devsync.v2.entity.ProfileDetails;
import com.devsync.v2.service.ProfileDetailsService;
import com.devsync.v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final ProfileDetailsService profileDetailsService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<ProfileDetailsDTO> findProfileDetails(@PathVariable String username) {
        return profileDetailsService.findByUsername(username);
    }

    @PutMapping("/profile/skills/{username}")
    public ResponseEntity<ProfileDetailsDTO> updateSkills(@PathVariable String username, @RequestBody UpdateSkillsDTO newSkills) {
        return profileDetailsService.updateSkills(username, newSkills);
    }

    @PutMapping("/profile/bio/{username}")
    public ResponseEntity<ProfileDetailsDTO> updateBio(@PathVariable String username, @RequestBody UpdateBioDTO newBio) {
        return profileDetailsService.updateBio(username, newBio);
    }

    @PutMapping("/profile/userlink/{username}")
    public ResponseEntity<ProfileDetailsDTO> updateUserLink(@PathVariable String username, @RequestBody UpdateUserLinkDTO newUserLink) {
        return profileDetailsService.updateUserLink(username, newUserLink);
    }

}
