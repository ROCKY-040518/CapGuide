package com.example.capguide.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.capguide.dto.ProjectPlanResponse;
import com.example.capguide.service.GeminiService;

@Controller
public class MainController {

    private final GeminiService geminiService;

    public MainController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/")
    public String index() {
        return "main"; // 우리가 1번 단계에서 만든 main.jsp를 호출합니다.
    }

    /**
     * 프론트엔드에서 { "keyword": "..." } 형태로 POST 요청을 보내면,
     * GeminiService를 통해 1~3개의 프로젝트 기획안 리스트를 JSON 배열로 반환한다.
     */
    @PostMapping(value = "/api/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<ProjectPlanResponse> search(@RequestBody Map<String, String> request) {
        String keyword = request.get("keyword");
        return geminiService.generateProjectIdeas(keyword);
    }
}