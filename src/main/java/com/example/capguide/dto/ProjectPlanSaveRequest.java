package com.example.capguide.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 프론트엔드에서 [Save] 버튼 클릭 시 전송되는 기획안 저장 요청 DTO.
 * Gemini가 생성한 카드 데이터 구조를 그대로 수신한다.
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectPlanSaveRequest {
    /** 프로젝트 제목 */
    private String title;

    /** 프로젝트 배경 */
    private String background;

    /** 핵심 기능 목록 */
    private List<String> features;

    /** 추천 기술 스택 */
    private List<String> techStack;

    /** 총 소요 기간 */
    private String duration;

    /** 주차별 상세 일정 */
    private List<String> detailedSchedule;

    /** 기대 효과 */
    private String expectedEffect;
}
