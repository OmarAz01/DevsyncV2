package com.devsync.v2.security.entity;


import com.devsync.v2.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;

}
