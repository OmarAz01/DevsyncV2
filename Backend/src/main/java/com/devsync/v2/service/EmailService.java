package com.devsync.v2.service;

public interface EmailService {

        void sendEmail(String to, String code);

        String generateCode();
}
