package com.devsync.v2.security.entity;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}
