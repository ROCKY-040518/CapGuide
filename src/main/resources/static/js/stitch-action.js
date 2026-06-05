document.addEventListener("DOMContentLoaded", function () {
    // 1. 제어할 HTML 엘리먼트들을 가져옵니다.
    const homeSection = document.getElementById("home-section");
    const loadingSection = document.getElementById("loading-section");
    const resultSection = document.getElementById("result-section");
    
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    
    // 결과 화면에 데이터를 꽂아넣을 타깃 엘리먼트
    const resTitle = document.getElementById("res-title");
    const resBackground = document.getElementById("res-background");
    const resFeatures = document.getElementById("res-features");
    const resTechStack = document.getElementById("res-tech-stack");
    const resDuration = document.getElementById("res-duration");
    const resDetailedSchedule = document.getElementById("res-detailed-schedule");
    const resExpectedEffect = document.getElementById("res-expected-effect");

    // Save / Share 버튼
    const btnSave = document.getElementById("btn-save");
    const btnShare = document.getElementById("btn-share");

    // ──────────────────────────────────────────────
    // Save 버튼 클릭 이벤트 (뼈대)
    // ──────────────────────────────────────────────
    if (btnSave) {
        btnSave.addEventListener("click", function () {
            alert("💾 저장 기능은 추후 업데이트 예정입니다.");
        });
    }

    // ──────────────────────────────────────────────
    // Share 버튼 클릭 이벤트 (뼈대)
    // ──────────────────────────────────────────────
    if (btnShare) {
        btnShare.addEventListener("click", function () {
            // 클립보드에 현재 URL 복사 시도
            if (navigator.clipboard && resTitle) {
                const shareText = resTitle.textContent + "\n" + (resBackground ? resBackground.textContent : "");
                navigator.clipboard.writeText(shareText).then(function () {
                    alert("📋 결과가 클립보드에 복사되었습니다!");
                }).catch(function () {
                    alert("🔗 공유 기능은 추후 업데이트 예정입니다.");
                });
            } else {
                alert("🔗 공유 기능은 추후 업데이트 예정입니다.");
            }
        });
    }

    // ──────────────────────────────────────────────
    // 검색 버튼 disabled 상태를 복원하는 헬퍼
    // ──────────────────────────────────────────────
    function enableSearchBtn() {
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        }
    }

    function disableSearchBtn() {
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.textContent = "Searching...";
        }
    }

    // 2. 폼 제출 이벤트 리스너 등록
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            // 🚨 브라우저가 페이지를 새로고침하는 기본 동작을 원천 차단합니다!
            e.preventDefault(); 

            const keyword = searchInput ? searchInput.value.trim() : "";
            
            // 검색어가 비어있으면 경고
            if (!keyword) {
                alert("프로젝트 키워드나 주제를 입력해주세요!");
                return;
            }

            console.log("입력된 키워드:", keyword);

            // [중복 클릭 방지] 검색 버튼 즉시 비활성화
            disableSearchBtn();

            // [화면 전환 1단계] 홈 화면을 숨기고 로딩 스피너를 보여줍니다.
            if (homeSection) homeSection.style.display = "none";
            if (loadingSection) loadingSection.style.display = "block";

            // [비동기 통신] 백엔드 MainController의 /api/search API로 요청을 보냅니다.
            fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ keyword: keyword })
            })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("서버 응답에 실패했습니다. (HTTP " + response.status + ")");
                }
                return response.json();
            })
            .then(function (data) {
                console.log("백엔드로부터 수신한 데이터:", data);

                // ── 기본 데이터 주입 ──
                if (resTitle) resTitle.textContent = data.title || "";
                if (resBackground) resBackground.textContent = data.background || "";

                // ── features 배열 → <li> 태그 동적 생성 ──
                if (resFeatures && Array.isArray(data.features)) {
                    resFeatures.innerHTML = "";
                    data.features.forEach(function (feature) {
                        var li = document.createElement("li");
                        li.className = "flex items-start gap-xs text-body-md font-body-md text-on-surface";
                        li.innerHTML =
                            '<span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings: \'FILL\' 1;">check_circle</span>' +
                            '<span>' + escapeHtml(feature) + '</span>';
                        resFeatures.appendChild(li);
                    });
                }

                // ── techStack 배열 → 칩 모양의 <span> 태그 동적 생성 ──
                if (resTechStack && Array.isArray(data.techStack)) {
                    resTechStack.innerHTML = "";
                    data.techStack.forEach(function (tech) {
                        var span = document.createElement("span");
                        span.className = "bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant";
                        span.textContent = tech;
                        resTechStack.appendChild(span);
                    });
                }

                // ── duration 문자열 → 텍스트 덮어쓰기 ──
                if (resDuration) {
                    resDuration.textContent = data.duration || "";
                }

                // ── detailedSchedule 배열 → 주차별 일정 <li> 동적 생성 ──
                if (resDetailedSchedule && Array.isArray(data.detailedSchedule)) {
                    resDetailedSchedule.innerHTML = "";
                    data.detailedSchedule.forEach(function (item, index) {
                        var li = document.createElement("li");
                        li.className = "flex items-start gap-xs text-body-md font-body-md text-on-surface";
                        li.innerHTML =
                            '<span class="material-symbols-outlined text-secondary text-[16px] mt-0.5" style="font-variation-settings: \'FILL\' 1;">event_note</span>' +
                            '<span>' + escapeHtml(item) + '</span>';
                        resDetailedSchedule.appendChild(li);
                    });
                }

                // ── expectedEffect 문자열 → 텍스트 덮어쓰기 ──
                if (resExpectedEffect) {
                    resExpectedEffect.textContent = data.expectedEffect || "";
                }

                // [화면 전환 2단계] 로딩 창을 숨기고 결과 화면을 띄웁니다.
                if (loadingSection) loadingSection.style.display = "none";
                if (resultSection) resultSection.style.display = "block";

                // 검색 버튼 복원
                enableSearchBtn();
            })
            .catch(function (error) {
                console.error("에러 발생:", error);
                alert("데이터를 처리하는 중 오류가 발생했습니다.\n" + error.message);
                // 에러 시 홈 화면으로 복구
                if (loadingSection) loadingSection.style.display = "none";
                if (homeSection) homeSection.style.display = "block";
                // 검색 버튼 복원
                enableSearchBtn();
            });
        });
    }

    /**
     * XSS 방지를 위한 HTML 이스케이프 유틸리티
     */
    function escapeHtml(text) {
        if (!text) return "";
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }
});