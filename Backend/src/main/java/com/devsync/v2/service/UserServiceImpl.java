package com.devsync.v2.service;


import com.devsync.v2.dto.UserDTO;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<UserDTO> findUser(Long id) {
        Optional<UserEntity> user = userRepo.findByUserId(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        UserDTO userDTO = UserDTO.convertToDTO(user.get());
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }

    @Override
    public ResponseEntity<Long> deleteUser(Long id) {
        Optional<UserEntity> user = userRepo.findByUserId(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        try {
            userRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Override
    public ResponseEntity<UserDTO> findByUsername(String username) {
        Optional<UserEntity> user = userRepo.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        UserDTO userDTO = UserDTO.convertToDTO(user.get());
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }

    @Override
    public ResponseEntity<UserEntity> findByEmail(String email) {
        Optional<UserEntity> user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(user.get());

    }

    @Override
    public ResponseEntity<UserDTO> save(UserEntity user) {
        try {
            UserEntity newUser = userRepo.save(user);
            UserDTO userDTO = UserDTO.convertToDTO(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
