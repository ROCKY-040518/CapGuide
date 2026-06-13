package com.example.capguide.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.capguide.dto.ProjectPlanResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL = "gemini-3.1-flash-lite";
    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";

    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_BACKOFF_MS = 2000;

    // ──────────────────────────────────────────────
    // 메모리 캐시: 동일 키워드에 대한 중복 API 호출 방지
    // ──────────────────────────────────────────────
    private final ConcurrentHashMap<String, List<ProjectPlanResponse>> cache = new ConcurrentHashMap<>();

    private static final String SYSTEM_PROMPT = """
            너는 대학교의 모든 학문 분야(인문학, 사회과학, 자연과학, 공학, 예술, 체육 등)를 아우르는 캡스톤 디자인 및 졸업작품 최고 지도교수다.

            [목표]
            사용자가 입력한 키워드의 맥락을 분석하여 가장 적합한 전공 분야를 스스로 유추하고,
            유추한 전공의 특성에 맞춰 한 학기(약 16주) 안에 완료할 수 있는 실현 가능한 기획안을 작성해라.

            [출력 개수 규칙 — 반드시 준수]
            - 키워드가 추상적이거나 광범위한 단어(예: '인문학', '경영', '디자인', '환경')이면 → 반드시 3개의 서로 다른 방향의 기획안을 제안해라.
            - 키워드가 중간 수준의 구체성(예: '한국어 교육', '스포츠 마케팅')이면 → 2개의 기획안을 제안해라.
            - 키워드가 매우 구체적이고 좁은 주제(예: '조선시대 훈민정음 음운 변화 분석')이면 → 1개의 깊이 있는 기획안만 제안해라.

            [도메인 충실성 규칙 — 가장 중요]
            ★ 사용자가 IT, 소프트웨어, 공학, 프로그래밍을 명시적으로 언급하지 않은 경우:
              - AI, IoT, 빅데이터, 딥러닝, 앱 개발 등 첨단 기술을 억지로 끼워 넣지 마라.
              - 해당 학문 본연의 가치, 전통적 연구 방법론, 분석 도구에 집중해라.
              - 예시: 문학 → 텍스트 비평, 문헌 분석, 비교문학 방법론 / 철학 → 논증 분석, 사상사 연구 / 체육 → 체력 측정 도구, 영상 분석, 코칭 방법론 / 미술 → Adobe Creative Suite, 전시 기획
            ★ 사용자가 IT/기술 키워드를 명시한 경우에만 프로그래밍 언어, 프레임워크, 클라우드 등을 techStack에 포함해라.

            [techStack 작성 규칙]
            - 공학/IT 분야: 프로그래밍 언어, 프레임워크, DB, 클라우드 등 (예: Python, React, MySQL)
            - 인문/사회과학: 연구 방법론, 분석 도구, 통계 소프트웨어 등 (예: SPSS, NVivo, 문헌분석법, 설문조사)
            - 예술/디자인: 창작 도구, 제작 기법, 전시/공연 매체 등 (예: Figma, Premiere Pro, 도자기 성형, 3D 프린팅)
            - 체육/스포츠: 측정 장비, 분석 소프트웨어, 훈련 방법론 등 (예: Dartfish, GPS 트래커, VO2max 측정)
            - 각 요소는 반드시 하나의 도구명/방법론명만 짧게 적어라. '백엔드: Python' 같은 설명을 붙이지 마라.

            [출력 형식]
            응답은 반드시 아래의 JSON 배열 포맷으로만 출력해야 하며, JSON 외의 인사말이나 마크다운(```json 등) 기호는 절대 포함하지 마라.
            프로젝트가 1개이더라도 반드시 배열([]) 안에 넣어서 반환해라.
            [
              {
                "title": "[분야 이모지] 추천 주제: [사용자 키워드를 살린 구체적인 프로젝트 명칭]",
                "background": "이 프로젝트가 해결하고자 하는 현실의 문제점과 기획 의도를 2~3문장으로 요약",
                "features": ["핵심 기능/활동 1", "핵심 기능/활동 2", "핵심 기능/활동 3"],
                "techStack": ["[해당 분야에 적합한 도구/방법론 1]", "[도구 2]", "[도구 3]"],
                "duration": "기획 N주, 실행 N주 (총 한 학기 이내)",
                "detailedSchedule": ["1~2주차: 주제 선정 및 선행연구/자료 조사", "3~5주차: 연구 설계 및 환경 구축", "6~10주차: 핵심 연구/개발/제작 수행", "11~13주차: 결과 분석 및 검증", "14~16주차: 최종 발표 준비 및 보고서 작성"],
                "expectedEffect": "이 프로젝트가 완성되었을 때 기대되는 학술적·실질적 효과를 1~2문장으로 서술"
              }
            ]
            """;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 사용자의 키워드를 받아 Gemini API에 프롬프트를 전송하고,
     * 1~3개의 ProjectPlanResponse DTO 리스트로 파싱하여 반환한다.
     * 동일 키워드에 대해서는 캐시된 결과를 즉시 반환한다.
     * 503/429 에러 시 지수 백오프로 최대 3회 재시도한다.
     */
    public List<ProjectPlanResponse> generateProjectIdeas(String keyword) {
        // ── 캐시 히트 확인 ──
        String cacheKey = keyword.trim().toLowerCase();
        List<ProjectPlanResponse> cached = cache.get(cacheKey);
        if (cached != null) {
            log.info("캐시 히트: 키워드 '{}' 에 대한 기존 결과를 반환합니다.", keyword);
            return cached;
        }

        String url = GEMINI_URL + "?key=" + apiKey;

        // Gemini API 요청 바디 구성
        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", "키워드: " + keyword)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 8192
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        Exception lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                // 응답에서 생성된 텍스트 추출
                JsonNode root = objectMapper.readTree(response.getBody());
                String generatedText = root
                        .path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text")
                        .asText()
                        .trim();

                // JSON 배열을 List<ProjectPlanResponse>로 파싱
                List<ProjectPlanResponse> results = objectMapper.readValue(
                        generatedText, new TypeReference<List<ProjectPlanResponse>>() {});

                // 캐시에 저장
                cache.put(cacheKey, results);
                log.info("캐시 저장: 키워드 '{}' → {}개 프로젝트 캐싱 (캐시 크기: {})",
                        keyword, results.size(), cache.size());

                return results;

            } catch (HttpServerErrorException e) {
                lastException = e;
                log.warn("Gemini API 호출 실패 (시도 {}/{}): {} — {}",
                        attempt, MAX_RETRIES, e.getStatusCode(), e.getMessage());

                if (attempt < MAX_RETRIES) {
                    sleep(INITIAL_BACKOFF_MS * (1L << (attempt - 1)));
                }

            } catch (HttpClientErrorException e) {
                if (e.getStatusCode().value() == 429) {
                    lastException = e;
                    log.warn("Gemini API 요청 제한 (시도 {}/{}): {}",
                            attempt, MAX_RETRIES, e.getMessage());

                    if (attempt < MAX_RETRIES) {
                        sleep(INITIAL_BACKOFF_MS * (1L << (attempt - 1)));
                    }
                } else {
                    return List.of(buildErrorResponse("Gemini API 오류: " + e.getMessage()));
                }

            } catch (Exception e) {
                log.error("Gemini API 응답 처리 중 예외 발생: {}", e.getMessage(), e);
                return List.of(buildErrorResponse("응답 처리 중 오류: " + e.getMessage()));
            }
        }

        // 모든 재시도 실패
        String errorMsg = lastException != null ? lastException.getMessage() : "알 수 없는 오류";
        return List.of(buildErrorResponse("Gemini API가 현재 과부하 상태입니다. "
                + MAX_RETRIES + "회 재시도 후에도 실패했습니다. 잠시 후 다시 시도해 주세요. (" + errorMsg + ")"));
    }

    /** 에러 발생 시 프론트엔드가 파싱할 수 있는 DTO로 반환 */
    private ProjectPlanResponse buildErrorResponse(String message) {
        ProjectPlanResponse error = new ProjectPlanResponse();
        error.setTitle("⚠️ 오류 발생");
        error.setBackground(message);
        error.setFeatures(List.of("잠시 후 다시 시도해 주세요"));
        error.setTechStack(Collections.emptyList());
        error.setDuration("N/A");
        error.setDetailedSchedule(Collections.emptyList());
        error.setExpectedEffect("");
        return error;
    }

    /** 재시도 전 대기 (지수 백오프) */
    private void sleep(long millis) {
        try {
            log.info("Gemini API 재시도 전 {}ms 대기 중...", millis);
            Thread.sleep(millis);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            log.warn("재시도 대기 중 인터럽트 발생");
        }
    }
}
