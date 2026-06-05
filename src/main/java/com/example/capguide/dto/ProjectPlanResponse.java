package com.example.capguide.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Gemini API가 반환하는 캡스톤 프로젝트 기획 명세 JSON을 매핑하는 DTO.
 * 알 수 없는 필드가 있어도 역직렬화 실패하지 않도록 @JsonIgnoreProperties 적용.
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectPlanResponse {

    /** 추천 프로젝트 제목 */
    private String title;

    /** 프로젝트 배경 및 기획 의도 */
    private String background;

    /** 핵심 기능 목록 */
    private List<String> features;

    /** 추천 기술 스택 */
    private List<String> techStack;

    /** 총 소요 기간 요약 */
    private String duration;

    /** 주차별 상세 실행 일정 (예: ["1~2주차: 요구사항 분석", ...]) */
    private List<String> detailedSchedule;

    /** 프로젝트 완성 시 기대 효과 */
    private String expectedEffect;
}
