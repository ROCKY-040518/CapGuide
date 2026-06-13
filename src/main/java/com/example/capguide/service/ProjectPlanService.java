package com.example.capguide.service;

import com.example.capguide.domain.ProjectPlan;
import com.example.capguide.domain.User;
import com.example.capguide.dto.ProjectPlanSaveRequest;
import com.example.capguide.repository.ProjectPlanRepository;
import com.example.capguide.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjectPlanService {

    private final ProjectPlanRepository projectPlanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * 기획안을 DB에 저장한다.
     * 프론트엔드 카드의 전체 데이터를 summary(JSON)와 techStacks(JSON)로 나누어 저장.
     */
    @Transactional
    public ProjectPlan savePlan(Long userId, ProjectPlanSaveRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. (id=" + userId + ")"));

        // summary: background + features + detailedSchedule + expectedEffect를 JSON으로 직렬화
        String summaryJson = buildSummaryJson(request);

        // techStacks: 기술 스택 리스트를 JSON 배열 문자열로 직렬화
        String techStacksJson = serializeList(request.getTechStack());

        ProjectPlan plan = ProjectPlan.builder()
                .title(request.getTitle())
                .summary(summaryJson)
                .techStacks(techStacksJson)
                .build();

        plan.setUser(user);

        return projectPlanRepository.save(plan);
    }

    /**
     * 특정 사용자가 저장한 모든 기획안을 최신순으로 조회한다.
     */
    @Transactional(readOnly = true)
    public List<ProjectPlan> getPlansByUserId(Long userId) {
        return projectPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * 카드 데이터의 상세 내용을 하나의 JSON 문자열로 직렬화한다.
     */
    private String buildSummaryJson(ProjectPlanSaveRequest request) {
        Map<String, Object> summaryMap = new HashMap<>();
        summaryMap.put("background", request.getBackground());
        summaryMap.put("features", request.getFeatures());
        summaryMap.put("duration", request.getDuration());
        summaryMap.put("detailedSchedule", request.getDetailedSchedule());
        summaryMap.put("expectedEffect", request.getExpectedEffect());

        try {
            return objectMapper.writeValueAsString(summaryMap);
        } catch (JsonProcessingException e) {
            // 직렬화 실패 시 평문 폴백
            return request.getBackground() != null ? request.getBackground() : "";
        }
    }

    private String serializeList(List<String> list) {
        if (list == null || list.isEmpty()) return "[]";
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
