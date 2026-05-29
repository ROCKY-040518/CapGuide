document.addEventListener("DOMContentLoaded", function () {
    // 1. 제어할 HTML 엘리먼트들을 가져옵니다.
    const homeSection = document.getElementById("home-section");
    const loadingSection = document.getElementById("loading-section");
    const resultSection = document.getElementById("result-section");
    
    const searchForm = document.getElementById("search-form"); // 폼 엘리먼트 가로채기
    const searchInput = document.getElementById("search-input");
    
    // 결과 화면에 데이터를 꽂아넣을 타깃 엘리먼트
    const resTitle = document.getElementById("res-title");
    const resBackground = document.getElementById("res-background");

    // 2. 폼 제출 이벤트 리스너 등록
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            // 🚨 [핵심 수정] 브라우저가 페이지를 새로고침하는 기본 동작을 원천 차단합니다!
            e.preventDefault(); 

            const keyword = searchInput.value.trim();
            
            // 검색어가 비어있으면 경고
            if (!keyword) {
                alert("프로젝트 키워드나 주제를 입력해주세요!");
                return;
            }

            console.log("입력된 키워드:", keyword);

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
            .then(response => {
                if (!response.ok) {
                    throw new Error("서버 응답에 실패했습니다.");
                }
                return response.json();
            })
            .then(data => {
                console.log("백엔드로부터 수신한 Mock 데이터:", data);

                // [데이터 주입] 결과 리포트 화면의 ID 영역에 데이터를 꽂아넣습니다.
                if (resTitle) resTitle.innerText = data.title;
                if (resBackground) resBackground.innerText = data.background;

                // [화면 전환 2단계] 로딩 창을 숨기고 결과 화면을 띄웁니다.
                if (loadingSection) loadingSection.style.display = "none";
                if (resultSection) resultSection.style.display = "block";
            })
            .catch(error => {
                console.error("에러 발생:", error);
                alert("데이터를 처리하는 중 오류가 발생했습니다.");
                // 에러 시 홈 화면으로 복구
                if (loadingSection) loadingSection.style.display = "none";
                if (homeSection) homeSection.style.display = "block";
            });
        });
    }
});