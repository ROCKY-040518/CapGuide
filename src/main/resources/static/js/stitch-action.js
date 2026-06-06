document.addEventListener("DOMContentLoaded", function () {
    // ──────────────────────────────────────────────
    // 전역 플래그: Race Condition 방어
    // ──────────────────────────────────────────────
    var isFetching = false;

    // 1. 제어할 HTML 엘리먼트들을 가져옵니다.
    var homeSection = document.getElementById("home-section");
    var loadingSection = document.getElementById("loading-section");
    var resultSection = document.getElementById("result-section");
    
    var searchForm = document.getElementById("search-form");
    var searchInput = document.getElementById("search-input");
    var searchBtn = document.getElementById("search-btn");
    
    // 다중 카드 렌더링용
    var cardTemplate = document.getElementById("card-template");
    var cardsContainer = document.getElementById("result-cards-container");

    // ──────────────────────────────────────────────
    // 검색 버튼 상태 제어 헬퍼
    // ──────────────────────────────────────────────
    function enableSearchBtn() {
        isFetching = false;
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        }
    }

    function disableSearchBtn() {
        isFetching = true;
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.textContent = "Searching...";
        }
    }

    // ──────────────────────────────────────────────
    // 단일 카드 렌더링 함수
    // ──────────────────────────────────────────────
    function renderCard(data, index) {
        if (!cardTemplate) return null;

        var clone = cardTemplate.content.cloneNode(true);

        // 카드 번호별 그라데이션 색상 차별화
        var gradientBar = clone.querySelector(".bg-gradient-to-r");
        if (gradientBar && index > 0) {
            var gradients = [
                "from-primary to-primary-fixed",
                "from-tertiary to-tertiary-fixed",
                "from-secondary to-secondary-fixed"
            ];
            gradientBar.className = "absolute top-0 left-0 w-full h-1 bg-gradient-to-r " + gradients[index % gradients.length] + " opacity-80";
        }

        // title
        var titleEl = clone.querySelector('[data-field="title"]');
        if (titleEl) titleEl.textContent = data.title || "";

        // background
        var bgEl = clone.querySelector('[data-field="background"]');
        if (bgEl) bgEl.textContent = data.background || "";

        // features
        var featuresEl = clone.querySelector('[data-field="features"]');
        if (featuresEl && Array.isArray(data.features)) {
            data.features.forEach(function (feature) {
                var li = document.createElement("li");
                li.className = "flex items-start gap-xs text-body-md font-body-md text-on-surface";
                li.innerHTML =
                    '<span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings: \'FILL\' 1;">check_circle</span>' +
                    '<span>' + escapeHtml(feature) + '</span>';
                featuresEl.appendChild(li);
            });
        }

        // techStack
        var techEl = clone.querySelector('[data-field="techStack"]');
        if (techEl && Array.isArray(data.techStack)) {
            data.techStack.forEach(function (tech) {
                var span = document.createElement("span");
                span.className = "inline-flex items-center bg-primary/10 text-primary text-label-md font-bold px-3 py-1 rounded-full border border-primary/20 shadow-sm";
                span.textContent = tech;
                techEl.appendChild(span);
            });
        }

        // detailedSchedule
        var scheduleEl = clone.querySelector('[data-field="detailedSchedule"]');
        if (scheduleEl && Array.isArray(data.detailedSchedule)) {
            data.detailedSchedule.forEach(function (item) {
                var li = document.createElement("li");
                li.className = "flex items-start gap-xs text-body-md font-body-md text-on-surface";
                li.innerHTML =
                    '<span class="material-symbols-outlined text-secondary text-[16px] mt-0.5" style="font-variation-settings: \'FILL\' 1;">event_note</span>' +
                    '<span>' + escapeHtml(item) + '</span>';
                scheduleEl.appendChild(li);
            });
        }

        // expectedEffect
        var effectEl = clone.querySelector('[data-field="expectedEffect"]');
        if (effectEl) effectEl.textContent = data.expectedEffect || "";

        // Save 버튼
        var saveBtn = clone.querySelector('[data-action="save"]');
        if (saveBtn) {
            saveBtn.addEventListener("click", function () {
                alert("💾 저장 기능은 추후 업데이트 예정입니다.");
            });
        }

        // Share 버튼
        var shareBtn = clone.querySelector('[data-action="share"]');
        if (shareBtn) {
            shareBtn.addEventListener("click", function () {
                var shareText = (data.title || "") + "\n" + (data.background || "");
                if (navigator.clipboard) {
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

        return clone;
    }

    // ──────────────────────────────────────────────
    // 전체 카드 리스트 렌더링
    // ──────────────────────────────────────────────
    function renderAllCards(dataArray) {
        // 기존 결과 완전 초기화
        if (cardsContainer) cardsContainer.innerHTML = "";

        if (!Array.isArray(dataArray) || dataArray.length === 0) return;

        dataArray.forEach(function (data, index) {
            var card = renderCard(data, index);
            if (card && cardsContainer) {
                cardsContainer.appendChild(card);
            }
        });
    }

    // ──────────────────────────────────────────────
    // 폼 제출 이벤트 리스너
    // ──────────────────────────────────────────────
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // 🚨 Race Condition 방어: 이미 요청 중이면 즉시 무시
            if (isFetching) {
                console.warn("이미 API 요청이 진행 중입니다. 중복 요청을 차단합니다.");
                return;
            }

            var keyword = searchInput ? searchInput.value.trim() : "";
            
            if (!keyword) {
                alert("프로젝트 키워드나 주제를 입력해주세요!");
                return;
            }

            console.log("입력된 키워드:", keyword);

            // 검색 버튼 비활성화 + 플래그 설정
            disableSearchBtn();

            // 기존 결과 화면 초기화 (플리커링 방지)
            if (cardsContainer) cardsContainer.innerHTML = "";

            // 화면 전환: 홈 → 로딩
            if (homeSection) homeSection.style.display = "none";
            if (resultSection) resultSection.style.display = "none";
            if (loadingSection) loadingSection.style.display = "block";

            // 비동기 통신
            fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyword: keyword })
            })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("서버 응답에 실패했습니다. (HTTP " + response.status + ")");
                }
                return response.json();
            })
            .then(function (dataArray) {
                console.log("백엔드로부터 수신한 데이터:", dataArray);

                // 다중 카드 렌더링
                renderAllCards(dataArray);

                // 화면 전환: 로딩 → 결과
                if (loadingSection) loadingSection.style.display = "none";
                if (resultSection) resultSection.style.display = "block";

                enableSearchBtn();
            })
            .catch(function (error) {
                console.error("에러 발생:", error);
                alert("데이터를 처리하는 중 오류가 발생했습니다.\n" + error.message);
                // 에러 시 홈 화면 복구
                if (loadingSection) loadingSection.style.display = "none";
                if (homeSection) homeSection.style.display = "block";
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