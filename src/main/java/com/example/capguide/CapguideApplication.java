package com.example.capguide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing; // <- 이 줄이 추가되어야 합니다.

@EnableJpaAuditing
@SpringBootApplication
public class CapguideApplication {
    public static void main(String[] args) {
        SpringApplication.run(CapguideApplication.class, args);
    }
}