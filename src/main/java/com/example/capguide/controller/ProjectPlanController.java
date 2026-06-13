package com.example.capguide.controller;

import com.example.capguide.domain.ProjectPlan;
import com.example.capguide.domain.User;
import com.example.capguide.dto.ProjectPlanSaveRequest;
import com.example.capguide.repository.UserRepository;
import com.example.capguide.service.ProjectPlanService;
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
     * 정규화된 엔티티에서 직접 필드를 읽어 프론트엔드 호환 형태로 변환한다.
     */
    @GetMapping
    public ResponseEntity<?> getMyPlans(HttpServletRequest httpRequest) {
        Long userId = getSessionUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        List<ProjectPlan> plans = projectPlanService.getPlansByUserId(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (ProjectPlan plan : plans) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", plan.getId());
            item.put("title", plan.getTitle());
            item.put("createdAt", plan.getCreatedAt().toString());
            item.put("background", plan.getBackground());
            item.put("duration", plan.getDuration());
            item.put("expectedEffect", plan.getExpectedEffect());

            // JSON 문자열 → List<String> 파싱
            item.put("features", parseJsonList(plan.getFeatures()));
            item.put("techStack", parseJsonList(plan.getTechStacks()));
            item.put("detailedSchedule", parseJsonList(plan.getDetailedSchedule()));

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

    // ── Private Helpers ──

    /**
     * JSON 배열 문자열을 List<String>으로 파싱한다.
     */
    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
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
