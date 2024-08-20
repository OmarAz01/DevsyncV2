package com.devsync.v2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "syncs")
public class SyncEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long syncId;
    private String message;
    private String status;
    private LocalDateTime dateOfSync;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private UserEntity recipient;

}
