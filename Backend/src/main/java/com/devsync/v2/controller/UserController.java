package com.devsync.v2.controller;

import com.devsync.v2.dto.*;
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

    @PutMapping("/profile/{username}/update")
    public ResponseEntity<ProfileDetailsDTO> updateProfile(@PathVariable String username, @RequestBody ProfileDetailsDTO updatedProfile) {
        return profileDetailsService.updateProfileDetails(username, updatedProfile);
    }

}
