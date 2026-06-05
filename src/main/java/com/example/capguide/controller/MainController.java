package com.example.capguide.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

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
     * GeminiService를 통해 실제 AI 응답(JSON 문자열)을 받아 그대로 반환한다.
     */
    @PostMapping(value = "/api/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String search(@RequestBody Map<String, String> request) {
        String keyword = request.get("keyword");
        return geminiService.generateProjectIdea(keyword);
    }
}