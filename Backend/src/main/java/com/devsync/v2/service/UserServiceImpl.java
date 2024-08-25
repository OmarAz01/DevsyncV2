package com.devsync.v2.service;


import com.devsync.v2.dto.ReportDTO;
import com.devsync.v2.dto.UserDTO;
import com.devsync.v2.entity.ReportEntity;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.ReportsRepo;
import com.devsync.v2.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final ReportsRepo reportsRepo;
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

    @Override
    public ResponseEntity<ReportDTO> reportUser(ReportDTO report) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            if (user.getUsername().equals(report.getReportedUser())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            UserEntity reportedUser = userRepo.findByUsername(report.getReportedUser()).orElse(null);
            if (reportedUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            UserEntity reportedBy = userRepo.findByUsername(user.getUsername()).orElse(null);
            if (reportedBy == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            // Check if the user has already reported the user before
            for (ReportEntity sentReports : reportedBy.getSentReports()) {
                if (sentReports.getReportedUser().getUsername().equals(reportedUser.getUsername())) {
                    return ResponseEntity.status(409).body(null);
                }
            }


            ReportEntity reportEntity = new ReportEntity();
            reportEntity.setReportedBy(reportedBy);
            reportEntity.setReportedUser(reportedUser);
            reportEntity.setReason(report.getReason());
            reportEntity.setStatus("Pending");
            LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
            reportEntity.setCreatedAt(now);
            try {
                reportsRepo.save(reportEntity);
                return ResponseEntity.status(HttpStatus.CREATED).body(ReportDTO.convertToDTO(reportEntity));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }
}
