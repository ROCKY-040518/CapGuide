package com.example.capguide.repository;

import com.example.capguide.domain.ProjectPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectPlanRepository extends JpaRepository<ProjectPlan, Long> {
    /**
     * 특정 사용자가 저장한 모든 기획안을 최신순으로 조회한다.
     */
    List<ProjectPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
}
