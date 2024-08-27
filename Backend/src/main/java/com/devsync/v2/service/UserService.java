package com.devsync.v2.service;

import com.devsync.v2.dto.ReportDTO;
import com.devsync.v2.dto.UserDTO;
import com.devsync.v2.entity.UserEntity;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<UserDTO> findUser(Long id);

    ResponseEntity<Long> deleteUser();

    ResponseEntity<UserDTO> findByUsername(String username);

    ResponseEntity<UserEntity> findByEmail(String email);

    ResponseEntity<UserDTO> save(UserEntity user);

    ResponseEntity<ReportDTO> reportUser(ReportDTO report);

}
