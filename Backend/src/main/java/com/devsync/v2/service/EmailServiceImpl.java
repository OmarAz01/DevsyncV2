package com.devsync.v2.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("devsync.noreply@gmail.com");
        message.setTo(to);
        message.setSubject("DevSync Email Verification");
        message.setText("Your verification code is: " + code + "\n\n" +
                "If you did not request this code, please ignore this email. It will expire in 30 minutes.");
        mailSender.send(message);
    }

    // Generate a 8 digit code
    public String generateCode() {
        return String.valueOf((int) (Math.random() * 90000000) + 10000000);
    }
}
