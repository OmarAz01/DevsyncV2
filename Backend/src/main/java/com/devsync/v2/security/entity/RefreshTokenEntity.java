package com.devsync.v2.security.entity;

import com.devsync.v2.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "refresh_tokens")
public class RefreshTokenEntity {

    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @MapsId
    @JoinColumn(name = "userId")
    private UserEntity user;

    private String lastAccessToken;

    private String refreshToken;
}
