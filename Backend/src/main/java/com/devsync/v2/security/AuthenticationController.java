package com.devsync.v2.security;
import com.devsync.v2.security.dto.ChangePasswordDTO;
import com.devsync.v2.security.dto.VerificationDTO;
import com.devsync.v2.security.entity.AuthenticationRequest;
import com.devsync.v2.security.entity.AuthenticationResponse;
import com.devsync.v2.security.entity.RegisterRequest;
import com.devsync.v2.security.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/validate")
    public void validate(
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        authService.validateToken(request, response);
    }

    @GetMapping("/logout")
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        authService.logout(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthenticationResponse> verify(
            @RequestBody VerificationDTO verification) {
        return authService.verify(verification);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDTO request) {
        return authService.changePassword(request);
    }


}
