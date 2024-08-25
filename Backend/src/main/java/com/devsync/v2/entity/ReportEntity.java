package com.devsync.v2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reports")
public class ReportEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportedByUserId", referencedColumnName = "userId", nullable = false)
    private UserEntity reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportedUserId", referencedColumnName = "userId", nullable = false)
    private UserEntity reportedUser;

    @Column(columnDefinition = "TEXT", length = 1000)
    private String reason;

    private String status;

    private LocalDateTime createdAt;
}
