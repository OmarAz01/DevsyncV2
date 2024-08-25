package com.devsync.v2.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "profile_details")
public class ProfileDetailsEntity {
    @Id
    private Long userId;
    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @MapsId
    @JoinColumn(name = "userId")
    private UserEntity user;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private String userLink;
    private String skills;
}
