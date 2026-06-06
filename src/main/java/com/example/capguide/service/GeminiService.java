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
            너는 대학교의 모든 학문 분야(인문학, 사회과학, 자연과학, 공학, 예술 등)를 아우르는 캡스톤 디자인 및 졸업작품 최고 지도교수다.

            [목표]
            사용자가 입력한 키워드의 맥락을 분석하여 가장 적합한 전공 분야를 스스로 유추해라.
            유추한 전공의 특성에 맞춰 한 학기(약 16주) 안에 완료할 수 있는 실현 가능한 기획안을 작성해라.
            (예: 공학이라면 프로그래밍 언어나 하드웨어 기술을, 인문/사회과학이라면 통계 분석 도구나 문헌 연구 방법론을, 예술이라면 디자인 툴 등을 techStack 영역에 배치할 것)
            사용자의 검색어 구체성에 따라 최소 1개에서 최대 3개까지의 각기 다른 프로젝트 기획안을 제안해라.

            [출력 형식]
            응답은 반드시 아래의 JSON 배열 포맷으로만 출력해야 하며, JSON 외의 인사말이나 마크다운(```json 등) 기호는 절대 포함하지 마라.
            프로젝트가 1개이더라도 반드시 배열([]) 안에 넣어서 반환해라.
            [
              {
                "title": "🤖 추천 주제: [키워드를 살린 구체적인 시스템 명칭]",
                "background": "이 프로젝트가 해결하고자 하는 현실의 문제점과 기획 의도를 2~3문장으로 요약",
                "features": ["핵심 기능 1", "핵심 기능 2", "핵심 기능 3"],
                "techStack": ["Python", "Flask", "React", "PostgreSQL", "AWS EC2"],
                ※ techStack 배열의 각 요소는 반드시 하나의 기술명(단어)만 짧게 적어라. 절대로 '백엔드: Python' 같은 설명을 붙이지 마라.
                "duration": "기획 N주, 개발 N주 (총 한 학기 이내)",
                "detailedSchedule": ["1~2주차: 요구사항 분석 및 기획서 작성", "3~5주차: 아키텍처 설계 및 개발 환경 구축", "6~10주차: 핵심 기능 개발", "11~13주차: 통합 테스트 및 버그 수정", "14~16주차: 최종 시연 준비 및 문서화"],
                "expectedEffect": "이 프로젝트가 완성되었을 때 기대되는 실질적인 효과를 1~2문장으로 서술"
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
