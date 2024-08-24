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
    public ResponseEntity<List<SyncDTO>> getReceivedSyncs() {
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
    public ResponseEntity<Void> updateSync(Long id, SyncDTO responseSync) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            UserEntity user = (UserEntity) principal;
            System.out.println(responseSync);
            try {
                Optional<SyncEntity> syncEntity = syncRepo.findById(id);
                if (syncEntity.isEmpty()) {
                    return ResponseEntity.status(404).body(null);
                }
                if (syncEntity.get().getRecipient().getUserId() != user.getUserId()) {
                    return ResponseEntity.status(403).body(null);
                }
                if (responseSync.getStatus().equals("Accepted")) {
                    // Create a new SyncEntity as a response to the original SyncEntity
                    SyncEntity responseToSync = new SyncEntity();
                    responseToSync.setSender(syncEntity.get().getRecipient());
                    responseToSync.setRecipient(syncEntity.get().getSender());
                    responseToSync.setDateOfSync(LocalDateTime.now(ZoneOffset.UTC));
                    responseToSync.setMessage(responseSync.getMessage());
                    responseToSync.setStatus("Response");
                    syncEntity.get().setStatus("Accepted");
                    syncRepo.save(responseToSync);
                    syncRepo.save(syncEntity.get());
                }
                else if (responseSync.getStatus().equals("Rejected")) {
                    syncEntity.get().setStatus("Rejected");
                    syncRepo.save(syncEntity.get());
                }
                else {
                    return ResponseEntity.status(400).body(null);
                }
            }
            catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }
            return ResponseEntity.ok().build();
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
            if (newSync.getRecipientUsername().equals(sender.getUsername())) {
                return ResponseEntity.status(400).body(null);
            }
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
                syncEntity.setStatus("Pending");
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
