package com.devsync.v2.security.service;

import com.devsync.v2.entity.EmailVerificationEntity;
import com.devsync.v2.entity.ProfileDetailsEntity;
import com.devsync.v2.entity.Role;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.EmailVerificationRepo;
import com.devsync.v2.security.dto.ChangePasswordDTO;
import com.devsync.v2.security.dto.VerificationDTO;
import com.devsync.v2.security.entity.AuthenticationRequest;
import com.devsync.v2.security.entity.AuthenticationResponse;
import com.devsync.v2.security.entity.RefreshTokenEntity;
import com.devsync.v2.security.entity.RegisterRequest;
import com.devsync.v2.security.repo.RefreshTokenRepo;
import com.devsync.v2.service.EmailService;
import com.devsync.v2.service.ProfileDetailsService;
import com.devsync.v2.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final ProfileDetailsService profileDetailsService;
    private final RefreshTokenRepo refreshTokenRepo;
    private final EmailVerificationRepo emailVerificationRepo;
    private final EmailService emailService;


    public ResponseEntity<AuthenticationResponse> register(RegisterRequest request) {
        if (request.getUsername().length() >= 11 || request.getUsername().length() <= 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AuthenticationResponse.builder()
                    .error("Username must be less than 11 characters and greater than 3").build());
        }
        if (userService.findByUsername(request.getUsername()).getBody() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AuthenticationResponse.builder()
                    .error("Username already exists").build());
        }
        if (userService.findByEmail(request.getEmail()).getBody() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AuthenticationResponse.builder()
                    .error("Email already exists").build());
        }

        // Send email verification code and save user with enabled set to false
        try {
            // Generate code and send email
            sendVerificationEmail(request.getEmail());
        }
        catch (Exception e) {
            System.out.println(e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthenticationResponse
                    .builder().error("Email verification failed").build());
        }
        try {
            // Create a new user with enabled set to false
            UserEntity user = new UserEntity();
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.USER);
            user.setEnabled(false);
            ProfileDetailsEntity profileDetails = new ProfileDetailsEntity();
            profileDetails.setSkills("Python, Java, C++");
            profileDetails.setBio("This is " + request.getUsername() + "'s bio. Nothing here yet.");
            profileDetails.setUser(user);
            userService.save(user);
            profileDetailsService.save(profileDetails);
        }
        catch (Exception e) {
            System.out.println(e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthenticationResponse
                    .builder().error("Registration failed").build());
        }
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    public ResponseEntity<AuthenticationResponse> verify(VerificationDTO verification) {
        EmailVerificationEntity emailVerificationEntity = emailVerificationRepo.findByEmail(verification.getEmail()).orElse(null);
        if (emailVerificationEntity == null || !emailVerificationEntity.getCode().equals(verification.getCode())) {
            return ResponseEntity.status(400).body(AuthenticationResponse.builder()
                    .error("Invalid code").build());
        }
        if (emailVerificationEntity.getCreatedAt().plusMinutes(30).isBefore(LocalDateTime.now())) {
            try {
                emailVerificationRepo.delete(emailVerificationEntity);
                sendVerificationEmail(verification.getEmail());
            } catch (Exception e) {
                return ResponseEntity.status(400).body(AuthenticationResponse.builder()
                        .error("Code expired").build());
            }
            return ResponseEntity.status(400).body(AuthenticationResponse.builder()
                    .error("Code expired").build());
        }
        emailVerificationRepo.delete(emailVerificationEntity);
        UserEntity user = userService.findByEmail(verification.getEmail()).getBody();
        if (user == null) {
            return ResponseEntity.status(400).body(AuthenticationResponse.builder()
                    .error("User not found").build());
        }
        user.setEnabled(true);
        try {
            userService.save(user);
            // Create refresh and access tokens
            Long userId = user.getUserId();
            String username = user.getUsername();
            String jwt = jwtService.generateToken(userId);
            String refreshToken = jwtService.generateRefreshToken(userId);
            refreshTokenService.createRefreshToken(user.getUserId(), refreshToken, jwt);
            return ResponseEntity.status(HttpStatus.OK).body(AuthenticationResponse.builder()
                    .id(userId).username(username).jwt(jwt).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AuthenticationResponse
                    .builder().error("User registration failed").build());
        }
    }


    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        UserEntity user = userService.findByEmail(request.getEmail()).getBody();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(AuthenticationResponse
                    .builder().error("User not found").build());
        } else if (!user.isEnabled()) {
            sendVerificationEmail(request.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(AuthenticationResponse
                    .builder().error("User not verified").build());
        } else {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword(), Collections.emptyList()));
        }

        Long userId = user.getUserId();
        String username = user.getUsername();
        // Delete old refresh token
        refreshTokenService.deleteRefreshToken(userId);
        // Create new refresh and access tokens
        String jwt = jwtService.generateToken(userId);
        String refreshToken = jwtService.generateRefreshToken(userId);
        refreshTokenService.createRefreshToken(user.getUserId(), refreshToken, jwt);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword(), Collections.emptyList()));
        return ResponseEntity.status(HttpStatus.OK).body(AuthenticationResponse.builder()
                .id(userId).username(username).jwt(jwt).build());
    }

    private void sendVerificationEmail(String email) {
        EmailVerificationEntity availableVerification = emailVerificationRepo.findByEmail(email).orElse(null);
        if (availableVerification != null) {
            // If the code was created less than 30 minutes ago, do not send another email
            if (availableVerification.getCreatedAt().plusMinutes(30).isAfter(LocalDateTime.now())) {
                return;
            }
            // If the code was created more than 30 minutes ago, delete the old code and send a new one
            emailVerificationRepo.delete(availableVerification);
        }
        try {
            String code = emailService.generateCode();
            emailService.sendEmail(email, code);
            EmailVerificationEntity emailVerificationEntity = new EmailVerificationEntity();
            emailVerificationEntity.setEmail(email);
            emailVerificationEntity.setCode(code);
            LocalDateTime createdAt = LocalDateTime.now();
            emailVerificationEntity.setCreatedAt(createdAt);
            emailVerificationRepo.save(emailVerificationEntity);
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }

    public void validateToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Validating token");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("No token found");
            return;
        }

        String jwt = authHeader.substring(7);
        Long userId = Long.valueOf(jwtService.getUserId(jwt));

        if (!jwtService.isTokenValid(jwt)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        if (jwtService.isTokenExpired(jwt)) {
            System.out.println("Token expired");
            // If the token is expired, check if there is a refresh token
            RefreshTokenEntity refreshTokenEntity = refreshTokenService.findByLastAccessToken(jwt).getBody();
            if (refreshTokenEntity == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Refresh token not found");
                return;
            }
            if (jwtService.isTokenExpired(refreshTokenEntity.getRefreshToken())) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Refresh token expired");
                return;
            }
            // If the refresh token is valid and not expired, create a new access token and update database with it
            String newJwt = jwtService.generateToken(userId);
            refreshTokenEntity.setLastAccessToken(newJwt);
            refreshTokenRepo.save(refreshTokenEntity);
            AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                    .id(userId).jwt(newJwt).build();
            new ObjectMapper().writeValue(response.getOutputStream(), authenticationResponse);
        } else {
            // Return the current token if it is valid and not expired
            AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                    .id(userId).jwt(jwt).build();
            new ObjectMapper().writeValue(response.getOutputStream(), authenticationResponse);
        }
    }

    public ResponseEntity<?> changePassword(ChangePasswordDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        System.out.println("Before checking principal");
        if (principal instanceof UserEntity) {
            System.out.println("Changing password for user" + ((UserEntity) principal).getUsername());
            UserEntity user = (UserEntity) principal;
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    user.getEmail(), request.getOldPassword(), Collections.emptyList()));
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            try {
                System.out.println("Saving user");
                userService.save(user);
                return ResponseEntity.ok(null);
            } catch (Exception e) {
                System.out.println(e.toString());
                return ResponseEntity.status(500).body(null);
            }
        }
        else {
            System.out.println("principal is not UserEntity");
            return ResponseEntity.status(403).body(null);
        }
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String jwt = authHeader.substring(7);
        Long id = Long.valueOf(jwtService.getUserId(jwt));
        refreshTokenService.deleteRefreshToken(id);
        response.setStatus(HttpServletResponse.SC_OK);
    }


}
