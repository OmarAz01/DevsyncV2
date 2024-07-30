package com.devsync.v2.controller;

import com.devsync.v2.dto.ProfileDetailsDTO;
import com.devsync.v2.dto.UserDTO;
import com.devsync.v2.entity.ProfileDetails;
import com.devsync.v2.service.ProfileDetailsService;
import com.devsync.v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final ProfileDetailsService profileDetailsService;

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDetailsDTO> findProfileDetails(@PathVariable String username) {
        return profileDetailsService.findByUsername(username);
    }
}
