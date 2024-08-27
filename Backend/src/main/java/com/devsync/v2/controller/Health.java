package com.devsync.v2.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class Health {
    @RequestMapping
    public ResponseEntity<?> health() {
        return ResponseEntity.ok().build();
    }
}
