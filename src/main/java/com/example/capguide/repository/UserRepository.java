package com.example.capguide.repository;

import com.example.capguide.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // 코파일럿이 빼먹었던 부분: 이메일 중복 검사를 위한 메서드
    boolean existsByEmail(String email);
}