package com.example.capguide.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "main"; // 우리가 1번 단계에서 만든 main.jsp를 호출합니다.
    }

    @PostMapping("/api/search")
    @ResponseBody
    public Map<String, String> mockSearch(@RequestBody Map<String, String> request) {
        String userKeyword = request.get("keyword");
        
        Map<String, String> mockResult = new HashMap<>();
        mockResult.put("title", "🤖 추천 주제: [" + userKeyword + "] 연계 스마트 시스템");
        mockResult.put("background", "이 프로젝트는 사용자가 입력한 " + userKeyword + " 분야의 고질적인 문제를 해결하기 위해 구상된 기획안입니다.");
        
        try { Thread.sleep(3000); } catch (InterruptedException e) { e.printStackTrace(); }

        return mockResult;
    }
}