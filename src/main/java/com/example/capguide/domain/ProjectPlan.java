package com.example.capguide.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 기획안(ProjectPlan) 엔티티 — 정규화된 컬럼 설계.
 *
 * [관계] User(1) ←→ ProjectPlan(N) 양방향
 * [정규화 전략]
 *   - 기존: summary(JSON blob) + techStacks(JSON blob) 2개 컬럼에 모든 데이터를 직렬화
 *   - 변경: AI 응답의 각 필드를 독립 컬럼으로 분리하여 1NF~3NF 정규형 준수
 *   - features, techStacks, detailedSchedule 등 List 데이터는 JSON 문자열로 저장 (MySQL TEXT)
 */
@Entity
@Table(name = "project_plan", indexes = {
        @Index(name = "idx_project_plan_user_id", columnList = "user_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── 연관관계: User(1) ← ProjectPlan(N) ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_project_plan_user_id"))
    private User user;

    // ── 기본 정보 ──

    /** 프로젝트 제목 */
    @Column(nullable = false, length = 255)
    private String title;

    /** 프로젝트 배경 및 기획 의도 */
    @Column(columnDefinition = "TEXT")
    private String background;

    /** 핵심 기능 목록 (JSON 배열: ["기능1", "기능2", ...]) */
    @Column(columnDefinition = "TEXT")
    private String features;

    /** 추천 기술 스택 / 도구 / 방법론 (JSON 배열: ["Python", "SPSS", ...]) */
    @Column(name = "tech_stacks", columnDefinition = "TEXT")
    private String techStacks;

    /** 총 소요 기간 (예: "기획 4주, 개발 12주") */
    @Column(length = 255)
    private String duration;

    /** 주차별 상세 일정 (JSON 배열: ["1~2주차: ...", "3~5주차: ..."]) */
    @Column(name = "detailed_schedule", columnDefinition = "TEXT")
    private String detailedSchedule;

    /** 프로젝트 완성 시 기대 효과 */
    @Column(name = "expected_effect", columnDefinition = "TEXT")
    private String expectedEffect;

    @Builder
    public ProjectPlan(String title, String background, String features,
                       String techStacks, String duration,
                       String detailedSchedule, String expectedEffect) {
        this.title = title;
        this.background = background;
        this.features = features;
        this.techStacks = techStacks;
        this.duration = duration;
        this.detailedSchedule = detailedSchedule;
        this.expectedEffect = expectedEffect;
    }

    // ── 양방향 연관관계 편의 메서드 ──
    public void setUser(User user) {
        this.user = user;
        if (!user.getProjectPlans().contains(this)) {
            user.getProjectPlans().add(this);
        }
    }
}