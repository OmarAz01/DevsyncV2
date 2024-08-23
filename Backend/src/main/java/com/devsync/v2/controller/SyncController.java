package com.devsync.v2.controller;

import com.devsync.v2.dto.SyncDTO;
import com.devsync.v2.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sync")
public class SyncController {
    private final SyncService syncService;

    @PostMapping()
    public ResponseEntity<SyncDTO> sync(@RequestBody SyncDTO newSync) {
        return syncService.createSync(newSync);
    }

    @GetMapping("/received")
    public ResponseEntity<List<SyncDTO>> getSyncs() {
        return syncService.getSyncs();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSync(@PathVariable Long id, @RequestBody SyncDTO responseSync) {
        return syncService.updateSync(id, responseSync);
    }


}
