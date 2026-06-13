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

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectPlanService {

    private final ProjectPlanRepository projectPlanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * 기획안을 DB에 저장한다.
     * 정규화된 엔티티에 각 필드를 직접 매핑하여 저장한다.
     * List 타입 필드(features, techStack, detailedSchedule)는 JSON 문자열로 직렬화한다.
     */
    @Transactional
    public ProjectPlan savePlan(Long userId, ProjectPlanSaveRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. (id=" + userId + ")"));

        ProjectPlan plan = ProjectPlan.builder()
                .title(request.getTitle())
                .background(request.getBackground())
                .features(serializeList(request.getFeatures()))
                .techStacks(serializeList(request.getTechStack()))
                .duration(request.getDuration())
                .detailedSchedule(serializeList(request.getDetailedSchedule()))
                .expectedEffect(request.getExpectedEffect())
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
     * 기획안을 삭제한다. 요청한 사용자가 해당 기획안의 소유자인지 반드시 검증한다.
     */
    @Transactional
    public void deletePlan(Long planId, Long userId) {
        ProjectPlan plan = projectPlanRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 기획안입니다. (id=" + planId + ")"));

        if (!plan.getUser().getId().equals(userId)) {
            throw new SecurityException("해당 기획안을 삭제할 권한이 없습니다.");
        }

        projectPlanRepository.delete(plan);
    }

    /**
     * List<String>을 JSON 배열 문자열로 직렬화한다.
     */
    private String serializeList(List<String> list) {
        if (list == null || list.isEmpty()) return "[]";
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
