package com.example.capguide.controller;

import com.example.capguide.domain.ProjectPlan;
import com.example.capguide.domain.User;
import com.example.capguide.dto.ProjectPlanSaveRequest;
import com.example.capguide.repository.UserRepository;
import com.example.capguide.service.ProjectPlanService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class ProjectPlanController {

    private final ProjectPlanService projectPlanService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * POST /api/plans
     * 현재 로그인된 사용자의 세션을 기반으로 기획안을 DB에 저장한다.
     */
    @PostMapping
    public ResponseEntity<?> savePlan(@RequestBody ProjectPlanSaveRequest request,
                                      HttpServletRequest httpRequest) {
        Long userId = getSessionUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        try {
            ProjectPlan saved = projectPlanService.savePlan(userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("title", saved.getTitle());
            response.put("message", "기획안이 성공적으로 저장되었습니다.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * GET /api/plans
     * 현재 로그인된 사용자가 저장한 모든 기획안을 반환한다.
     */
    @GetMapping
    public ResponseEntity<?> getMyPlans(HttpServletRequest httpRequest) {
        Long userId = getSessionUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        List<ProjectPlan> plans = projectPlanService.getPlansByUserId(userId);

        // 엔티티를 프론트엔드가 바로 렌더링할 수 있는 형태로 변환
        List<Map<String, Object>> result = new ArrayList<>();
        for (ProjectPlan plan : plans) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", plan.getId());
            item.put("title", plan.getTitle());
            item.put("createdAt", plan.getCreatedAt().toString());

            // summary JSON을 파싱하여 원본 카드 데이터 복원
            try {
                Map<String, Object> summaryData = objectMapper.readValue(
                        plan.getSummary(), new TypeReference<Map<String, Object>>() {});
                item.putAll(summaryData);
            } catch (JsonProcessingException e) {
                item.put("background", plan.getSummary());
            }

            // techStacks JSON을 파싱
            try {
                List<String> techStacks = objectMapper.readValue(
                        plan.getTechStacks(), new TypeReference<List<String>>() {});
                item.put("techStack", techStacks);
            } catch (Exception e) {
                item.put("techStack", List.of());
            }

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * DELETE /api/plans/{id}
     * 현재 로그인된 사용자가 소유한 기획안을 삭제한다.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id,
                                        HttpServletRequest httpRequest) {
        Long userId = getSessionUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        try {
            projectPlanService.deletePlan(id, userId);
            return ResponseEntity.ok(Map.of("message", "기획안이 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 세션에서 현재 로그인된 사용자의 ID를 추출한다.
     */
    private Long getSessionUserId(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            return (Long) session.getAttribute("USER_ID");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof String email) {
                return userRepository.findByEmail(email)
                        .map(User::getId)
                        .orElse(null);
            }
        }
        return null;
    }
}
