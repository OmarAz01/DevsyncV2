package com.devsync.v2.service;

import com.devsync.v2.dto.SyncDTO;
import com.devsync.v2.entity.SyncEntity;
import com.devsync.v2.entity.UserEntity;
import com.devsync.v2.repo.SyncRepo;
import com.devsync.v2.repo.UserRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SyncServiceImpl implements SyncService{
    private final SyncRepo syncRepo;
    private final UserRepo userRepo;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ResponseEntity<List<SyncDTO>> findBySender() {
        return null;
    }

    @Override
    public ResponseEntity<List<SyncDTO>> findByRecipient() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;

            List<SyncDTO> receivedSyncs = new ArrayList<>();
            try {
                for (SyncEntity sync : syncRepo.findByRecipient(user)) {
                    receivedSyncs.add(SyncDTO.convertToDTO(sync));
                }
            }
            catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }
            return ResponseEntity.ok(receivedSyncs);
        }
        else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @Override
    public ResponseEntity<List<SyncDTO>> getSyncs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            List<SyncDTO> receivedSyncs = new ArrayList<>();
            try {
                for (SyncEntity sync : syncRepo.findByRecipient(user)) {
                    receivedSyncs.add(SyncDTO.convertToDTO(sync));
                }
            }
            catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }
            return ResponseEntity.ok(receivedSyncs);
        }
        else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<SyncDTO> createSync(SyncDTO newSync) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity sender = (UserEntity) principal;
            sender = entityManager.merge(sender);
            try {
                Optional<UserEntity> recipient;
                recipient = userRepo.findByUsername(newSync.getRecipientUsername());
                if (recipient.isEmpty()) {
                    return ResponseEntity.status(404).body(null);
                }
                SyncEntity syncEntity = new SyncEntity();
                syncEntity.setSender(sender);
                syncEntity.setRecipient(recipient.get());
                LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
                syncEntity.setDateOfSync(now);
                syncEntity.setMessage(newSync.getMessage());
                syncEntity.setStatus("pending");
                syncRepo.save(syncEntity);
                return ResponseEntity.status(201).body(SyncDTO.convertToDTO(syncEntity));
            }
            catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }

        }
        return ResponseEntity.status(403).body(null);
    }

    @Override
    public void deleteSync(Long id) {

    }
}
