// ═════════════════════════════════════════════════════════════════════════════
// 🌍 전역 함수: Toast 알림 시스템
// ═════════════════════════════════════════════════════════════════════════════
window.showToast = function(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    
    let bgClass = 'bg-inverse-surface';
    let textClass = 'text-inverse-on-surface';
    let icon = 'info';
    
    if (type === 'success') {
        bgClass = 'bg-[#146c2e]';
        textClass = 'text-white';
        icon = 'check_circle';
    } else if (type === 'warning' || type === 'coming-soon') {
        bgClass = 'bg-secondary-container';
        textClass = 'text-on-secondary-container';
        icon = 'construction';
    } else if (type === 'error') {
        bgClass = 'bg-error-container';
        textClass = 'text-on-error-container';
        icon = 'error';
    }

    toast.className = `flex items-center gap-sm px-4 py-3 rounded shadow-lg ${bgClass} ${textClass} toast-enter max-w-md`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">${icon}</span>
        <span class="text-body-md font-medium">${message}</span>
    `;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
};

document.addEventListener("DOMContentLoaded", function () {
    // ──────────────────────────────────────────────
    // 전역 변수: 인증 상태 관리
    // ──────────────────────────────────────────────
    var currentUser = null;  // 현재 로그인 사용자 정보
    var isFetching = false;

    // 1. 제어할 HTML 엘리먼트들을 가져옵니다.
    var homeSection = document.getElementById("home-section");
    var loadingSection = document.getElementById("loading-section");
    var resultSection = document.getElementById("result-section");
    
    // 인증 모달 엘리먼트
    var authModal = document.getElementById("auth-modal");
    var closeAuthModalBtn = document.getElementById("close-auth-modal");
    var loginTab = document.getElementById("login-tab");
    var signupTab = document.getElementById("signup-tab");
    var loginForm = document.getElementById("login-form");
    var signupForm = document.getElementById("signup-form");
    
    var searchForm = document.getElementById("search-form");
    var searchInput = document.getElementById("search-input");
    var searchBtn = document.getElementById("search-btn");
    var clearBtn = document.getElementById("clear-btn");
    var placeholderEl = document.getElementById("placeholder-text");
    
    // 프로필 드롭다운 엘리먼트
    var profileBtn = document.getElementById("profile-btn");
    var profileIcon = document.getElementById("profile-icon");
    var profileInitial = document.getElementById("profile-initial");
    var profileDropdown = document.getElementById("profile-dropdown");
    var dropdownUsername = document.getElementById("dropdown-username");
    var dropdownEmail = document.getElementById("dropdown-email");
    var logoutBtn = document.getElementById("logout-btn");
    
    // 다중 카드 렌더링용
    var cardTemplate = document.getElementById("card-template");
    var cardsContainer = document.getElementById("result-cards-container");

    // ──────────────────────────────────────────────
    // 페이지 로드 시 로그인 상태 확인
    // ──────────────────────────────────────────────
    function updateProfileUI() {
        if (currentUser && currentUser.id) {
            // 로그인 상태
            if (profileIcon) profileIcon.classList.add("hidden");
            if (profileInitial) {
                profileInitial.classList.remove("hidden");
                profileInitial.textContent = (currentUser.nickname || "U").charAt(0).toUpperCase();
            }
            if (dropdownUsername) dropdownUsername.textContent = currentUser.nickname || "User";
            if (dropdownEmail) dropdownEmail.textContent = currentUser.email || "";
        } else {
            // 비로그인 상태
            if (profileIcon) profileIcon.classList.remove("hidden");
            if (profileInitial) profileInitial.classList.add("hidden");
        }
    }

    function checkLoginStatus() {
        fetch("/api/auth/me", {
            method: "GET",
            credentials: "include"  // 세션 쿠키 포함
        })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
            if (result.ok && result.data.id) {
                currentUser = result.data;
                updateProfileUI();
                console.log("로그인 상태 확인됨:", currentUser);
            } else {
                currentUser = null;
                updateProfileUI();
                console.log("로그인 되지 않은 상태");
            }
        })
        .catch(function (error) {
            console.error("로그인 상태 확인 실패:", error);
            currentUser = null;
            updateProfileUI();
        });
    }
    
    // 페이지 로드 시 실행
    checkLoginStatus();

    // ──────────────────────────────────────────────
    // 프로필 드롭다운 관리
    // ──────────────────────────────────────────────
    function toggleDropdown(show) {
        if (show) {
            if (profileDropdown) {
                profileDropdown.classList.remove("hidden");
                setTimeout(() => {
                    profileDropdown.classList.remove("opacity-0");
                    profileDropdown.classList.add("opacity-100");
                }, 10);
                if (profileBtn) profileBtn.setAttribute("aria-expanded", "true");
            }
        } else {
            if (profileDropdown) {
                profileDropdown.classList.remove("opacity-100");
                profileDropdown.classList.add("opacity-0");
                setTimeout(() => {
                    profileDropdown.classList.add("hidden");
                }, 200);
                if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            }
        }
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!currentUser || !currentUser.id) {
                // 미로그인: 로그인 모달 열기
                if (authModal) authModal.classList.remove("hidden");
                if (loginForm) loginForm.classList.remove("hidden");
                if (signupForm) signupForm.classList.add("hidden");
                if (loginTab) loginTab.classList.add("border-b-2", "border-primary", "text-primary");
                if (signupTab) signupTab.classList.remove("border-b-2", "border-primary");
            } else {
                // 로그인: 드롭다운 토글
                const isHidden = profileDropdown && profileDropdown.classList.contains("hidden");
                toggleDropdown(isHidden);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentUser = null;
                updateProfileUI();
                toggleDropdown(false);
                showToast("로그아웃 되었습니다.", "info");
            })
            .catch(function (error) {
                console.error("로그아웃 오류:", error);
                showToast("로그아웃 중 오류가 발생했습니다.", "error");
            });
        });
    }

    if (profileDropdown) {
        profileDropdown.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    document.addEventListener("click", function (e) {
        if (profileDropdown && !profileDropdown.classList.contains("hidden") && profileBtn && !profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    // ──────────────────────────────────────────────
    // 모달 관련 헬퍼 함수
    // ──────────────────────────────────────────────
    function openAuthModal() {
        if (authModal) authModal.classList.remove("hidden");
    }

    function closeAuthModal() {
        if (authModal) authModal.classList.add("hidden");
    }

    function switchToLoginForm() {
        if (loginForm) loginForm.classList.remove("hidden");
        if (signupForm) signupForm.classList.add("hidden");
        if (loginTab) loginTab.classList.add("border-b-2", "border-primary", "text-primary");
        if (signupTab) signupTab.classList.remove("border-b-2", "border-primary");
    }

    function switchToSignupForm() {
        if (loginForm) loginForm.classList.add("hidden");
        if (signupForm) signupForm.classList.remove("hidden");
        if (loginTab) loginTab.classList.remove("border-b-2", "border-primary");
        if (signupTab) signupTab.classList.add("border-b-2", "border-primary", "text-primary");
    }

    // ──────────────────────────────────────────────
    // 3. 모달 이벤트 리스너
    // ──────────────────────────────────────────────
    if (closeAuthModalBtn) {
        closeAuthModalBtn.addEventListener("click", closeAuthModal);
    }

    if (loginTab) {
        loginTab.addEventListener("click", switchToLoginForm);
    }

    if (signupTab) {
        signupTab.addEventListener("click", switchToSignupForm);
    }

    // 모달 외부 클릭 시 닫기
    if (authModal) {
        authModal.addEventListener("click", function (e) {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    // ──────────────────────────────────────────────
    // 4. 로그인 API 호출
    // ──────────────────────────────────────────────
    var loginSubmitBtn = document.getElementById("login-submit");
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            var email = document.getElementById("login-email").value.trim();
            var password = document.getElementById("login-password").value.trim();
            var loginError = document.getElementById("login-error");

            if (!email || !password) {
                if (loginError) {
                    loginError.textContent = "이메일과 비밀번호를 입력하세요.";
                    loginError.classList.remove("hidden");
                }
                return;
            }

            fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email, password: password })
            })
            .then(function (response) {
                return response.json().then(function (data) {
                    return { ok: response.ok, data: data };
                });
            })
            .then(function (result) {
                if (result.ok) {
                    currentUser = result.data;
                    updateProfileUI();
                    showToast("로그인 성공!", "success");
                    closeAuthModal();
                    // 폼 초기화
                    document.getElementById("login-email").value = "";
                    document.getElementById("login-password").value = "";
                    if (loginError) loginError.classList.add("hidden");
                } else {
                    if (loginError) {
                        loginError.textContent = result.data.message || "로그인 실패";
                        loginError.classList.remove("hidden");
                    }
                    showToast(result.data.message || "로그인 실패", "error");
                }
            })
            .catch(function (error) {
                console.error("로그인 오류:", error);
                if (loginError) {
                    loginError.textContent = "서버 오류가 발생했습니다.";
                    loginError.classList.remove("hidden");
                }
            });
        });
    }

    // ──────────────────────────────────────────────
    // 5. 회원가입 API 호출
    // ──────────────────────────────────────────────
    var signupSubmitBtn = document.getElementById("signup-submit");
    if (signupSubmitBtn) {
        signupSubmitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            var email = document.getElementById("signup-email").value.trim();
            var password = document.getElementById("signup-password").value.trim();
            var nickname = document.getElementById("signup-nickname").value.trim();
            var signupError = document.getElementById("signup-error");

            if (!email || !password || !nickname) {
                if (signupError) {
                    signupError.textContent = "모든 필드를 입력하세요.";
                    signupError.classList.remove("hidden");
                }
                return;
            }

            fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password, nickname: nickname })
            })
            .then(function (response) {
                return response.json().then(function (data) {
                    return { ok: response.ok, data: data };
                });
            })
            .then(function (result) {
                if (result.ok) {
                    showToast("회원가입 성공! 로그인해주세요.", "success");
                    // 로그인 폼으로 전환
                    switchToLoginForm();
                    // 폼 초기화
                    document.getElementById("signup-email").value = "";
                    document.getElementById("signup-password").value = "";
                    document.getElementById("signup-nickname").value = "";
                    if (signupError) signupError.classList.add("hidden");
                } else {
                    if (signupError) {
                        signupError.textContent = result.data.message || "회원가입 실패";
                        signupError.classList.remove("hidden");
                    }
                    showToast(result.data.message || "회원가입 실패", "error");
                }
            })
            .catch(function (error) {
                console.error("회원가입 오류:", error);
                if (signupError) {
                    signupError.textContent = "서버 오류가 발생했습니다.";
                    signupError.classList.remove("hidden");
                }
            });
        });
    }

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
                // 로그인 상태 확인
                if (!currentUser || !currentUser.id) {
                    openAuthModal();
                    switchToLoginForm();
                    showToast("로그인 후 저장할 수 있습니다.", "coming-soon");
                    return;
                }

                // 이미 저장 중이면 중복 클릭 방어
                if (saveBtn.disabled) return;
                saveBtn.disabled = true;
                var originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Saving...';

                // 카드 데이터를 서버로 전송
                var planData = {
                    title: data.title || "",
                    background: data.background || "",
                    features: data.features || [],
                    techStack: data.techStack || [],
                    duration: data.duration || "",
                    detailedSchedule: data.detailedSchedule || [],
                    expectedEffect: data.expectedEffect || ""
                };

                fetch("/api/plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(planData)
                })
                .then(function (response) {
                    return response.json().then(function (body) {
                        return { ok: response.ok, data: body };
                    });
                })
                .then(function (result) {
                    if (result.ok) {
                        showToast("기획안이 성공적으로 저장되었습니다!", "success");
                        // 저장 완료 상태로 버튼 변경
                        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Saved';
                        saveBtn.classList.remove("bg-primary");
                        saveBtn.classList.add("bg-[#146c2e]");
                    } else {
                        showToast(result.data.message || "저장 실패", "error");
                        saveBtn.innerHTML = originalText;
                        saveBtn.disabled = false;
                    }
                })
                .catch(function (error) {
                    console.error("저장 오류:", error);
                    showToast("저장 중 오류가 발생했습니다.", "error");
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                });
            });
        }

        // Share 버튼
        var shareBtn = clone.querySelector('[data-action="share"]');
        if (shareBtn) {
            shareBtn.addEventListener("click", function () {
                var shareText = (data.title || "") + "\n" + (data.background || "");
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(function () {
                        showToast("📋 클립보드에 복사되었습니다!", "success");
                    }).catch(function () {
                        showToast("공유 기능 개발 중입니다.", "coming-soon");
                    });
                } else {
                    showToast("공유 기능 개발 중입니다.", "coming-soon");
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
    // Coming Soon 핸들러
    // ──────────────────────────────────────────────
    function handleComingSoon(e) {
        e.preventDefault();
        showToast("이 기능은 곧 출시될 예정입니다.", "coming-soon");
    }

    document.querySelectorAll(".coming-soon-link").forEach(function (link) {
        link.addEventListener("click", handleComingSoon);
    });

    document.querySelectorAll(".coming-soon-btn").forEach(function (btn) {
        btn.addEventListener("click", handleComingSoon);
    });

    // ──────────────────────────────────────────────
    // 검색창 기능 (플레이스홀더 로테이션)
    // ──────────────────────────────────────────────
    var placeholders = [
        "인문학 캡스톤 주제",
        "드론 공학 과제",
        "AI 활용 비즈니스 모델",
        "Computer Science Thesis"
    ];
    var currentPlaceholderIdx = 0;

    function togglePlaceholderVisibility() {
        if (!searchInput || !placeholderEl) return;

        if (searchInput.value.trim() !== "" || document.activeElement === searchInput) {
            placeholderEl.style.opacity = "0";
            if (clearBtn) clearBtn.classList.remove("hidden");
        } else {
            placeholderEl.style.opacity = "1";
            if (clearBtn) clearBtn.classList.add("hidden");
        }
    }

    if (searchInput) {
        searchInput.addEventListener("focus", togglePlaceholderVisibility);
        searchInput.addEventListener("blur", togglePlaceholderVisibility);
        searchInput.addEventListener("input", togglePlaceholderVisibility);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
                togglePlaceholderVisibility();
            }
        });
    }

    // 3초마다 플레이스홀더 로테이션
    setInterval(function () {
        if (!searchInput || !placeholderEl) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") return;

        placeholderEl.classList.remove("placeholder-visible");
        placeholderEl.classList.add("placeholder-hidden");

        setTimeout(function () {
            currentPlaceholderIdx = (currentPlaceholderIdx + 1) % placeholders.length;
            placeholderEl.textContent = placeholders[currentPlaceholderIdx];
            requestAnimationFrame(function () {
                placeholderEl.classList.remove("placeholder-hidden");
                placeholderEl.classList.add("placeholder-visible");
            });
        }, 500);
    }, 3000);

    // ──────────────────────────────────────────────
    // 검색 실행 함수
    // ──────────────────────────────────────────────
    function performSearch(query) {
        var term = query || (searchInput ? searchInput.value.trim() : "");
        if (!term) {
            if (searchInput) searchInput.focus();
            return;
        }

        console.log("검색 키워드:", term);
        if (homeSection) homeSection.style.display = "none";
        if (resultSection) resultSection.style.display = "none";
        if (loadingSection) loadingSection.style.display = "block";

        // 검색 API 호출
        fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: term })
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("검색 요청 실패 (HTTP " + response.status + ")");
            }
            return response.json();
        })
        .then(function (dataArray) {
            console.log("검색 결과:", dataArray);
            renderAllCards(dataArray);
            if (loadingSection) loadingSection.style.display = "none";
            if (resultSection) resultSection.style.display = "block";
            showToast("검색 완료!", "success");
        })
        .catch(function (error) {
            console.error("검색 오류:", error);
            if (loadingSection) loadingSection.style.display = "none";
            if (homeSection) homeSection.style.display = "block";
            showToast("검색 중 오류가 발생했습니다.", "error");
        });
    }

    // 엔터 키 및 Search 버튼
    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            performSearch();
        });
    }

    // I'm Feeling Lucky 버튼
    var luckyBtn = document.getElementById("lucky-btn");
    var luckyTopics = [
        "Humanities Capstone",
        "AI for Medicine",
        "Sustainable Architecture",
        "Fintech Innovations",
        "Renewable Energy Networks"
    ];

    if (luckyBtn) {
        luckyBtn.addEventListener("click", function () {
            var randomTopic = luckyTopics[Math.floor(Math.random() * luckyTopics.length)];
            if (searchInput) {
                searchInput.value = randomTopic;
                togglePlaceholderVisibility();
            }
            performSearch(randomTopic);
        });
    }

    // Trending 링크
    document.querySelectorAll(".trending-link").forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var topic = e.target.getAttribute("data-topic");
            if (topic && searchInput) {
                searchInput.value = topic;
                togglePlaceholderVisibility();
                performSearch(topic);
            }
        });
    });

    // ──────────────────────────────────────────────
    // 폼 제출 이벤트 리스너 (기존 - 제거 예정)
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
                showToast("프로젝트 키워드나 주제를 입력해주세요!", "warning");
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
                showToast("데이터를 처리하는 중 오류가 발생했습니다.", "error");
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