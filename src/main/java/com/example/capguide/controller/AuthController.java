package com.example.capguide.controller;

import com.example.capguide.domain.User;
import com.example.capguide.dto.AuthDto.*;
import com.example.capguide.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse("이미 존재하는 이메일입니다."));
        }

        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();
        userRepository.save(newUser);

        return ResponseEntity.ok(new AuthResponse("회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("USER_ID", user.getId());

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            return ResponseEntity.ok(new AuthResponse(user.getId(), user.getEmail(), user.getNickname()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("이메일 또는 비밀번호가 일치하지 않습니다."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> checkSession(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            Long userId = (Long) session.getAttribute("USER_ID");
            
            // .longValue()를 사용하여 Null type safety 경고 완벽 해결
            User user = userRepository.findById(userId.longValue()).orElse(null);
            
            if (user != null) {
                return ResponseEntity.ok(new AuthResponse(user.getId(), user.getEmail(), user.getNickname()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("로그인되지 않았습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(new AuthResponse("로그아웃 성공"));
    }
}