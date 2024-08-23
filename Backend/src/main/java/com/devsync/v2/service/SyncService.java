package com.devsync.v2.service;

import com.devsync.v2.dto.SyncDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SyncService {

    ResponseEntity<List<SyncDTO>> findBySender();
    ResponseEntity<List<SyncDTO>> findByRecipient();
    ResponseEntity<SyncDTO> createSync(SyncDTO newSync);
    void deleteSync(Long id);
    ResponseEntity<List<SyncDTO>> getSyncs();
    ResponseEntity<Void> updateSync(Long id, SyncDTO responseSync);
}
