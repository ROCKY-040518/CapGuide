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
    var resetBtn = document.getElementById("reset-search-btn");
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
            } else {
                currentUser = null;
                updateProfileUI();
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

    function toggleSavedPlansModal(show) {
        var modal = document.getElementById("saved-plans-modal");
        if (!modal) return;

        if (show) {
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        } else {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    }

    // 삭제 API 호출 후 목록 새로고침용 캐시
    var cachedPlans = [];

    function deleteSavedPlan(planId) {
        fetch("/api/plans/" + planId, {
            method: "DELETE",
            credentials: "include"
        })
        .then(function (response) {
            return response.json().then(function (body) {
                return { ok: response.ok, data: body };
            });
        })
        .then(function (result) {
            if (result.ok) {
                showToast("기획안이 삭제되었습니다.", "success");
                // 캐시에서 제거 후 즉시 재렌더링
                cachedPlans = cachedPlans.filter(function (p) { return p.id !== planId; });
                renderSavedPlans(cachedPlans);
            } else {
                showToast(result.data.message || "삭제 실패", "error");
            }
        })
        .catch(function (error) {
            console.error("삭제 오류:", error);
            showToast("삭제 중 오류가 발생했습니다.", "error");
        });
    }

    function renderSavedPlans(plans) {
        cachedPlans = plans; // 캐시 갱신
        var listEl = document.getElementById("saved-plans-list");
        if (!listEl) return;
        listEl.innerHTML = "";

        if (!Array.isArray(plans) || plans.length === 0) {
            listEl.innerHTML = '<div class="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-body-md text-secondary">저장된 기획안이 없습니다.</div>';
            return;
        }

        plans.forEach(function (plan, idx) {
            var detailId = "saved-detail-" + idx;
            var card = document.createElement("div");
            card.className = "rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden";

            // --- 헤더 영역 ---
            var headerHtml =
                '<div class="p-6 pb-4">' +
                    '<div class="flex items-center justify-between gap-4 mb-3">' +
                        '<div class="flex-1 min-w-0">' +
                            '<p class="text-label-lg font-semibold text-on-surface truncate">' + escapeHtml(plan.title || "제목 없음") + '</p>' +
                            '<p class="text-body-sm text-on-surface-variant mt-0.5">저장일: ' + escapeHtml(plan.createdAt || "-") + '</p>' +
                        '</div>' +
                        '<span class="inline-flex items-center rounded-full bg-primary-container px-3 py-1 text-label-sm font-medium text-on-primary-container shrink-0">Saved</span>' +
                    '</div>' +
                    '<p class="text-body-md text-on-surface-variant">' + escapeHtml(plan.background || "") + '</p>' +
                '</div>';

            // --- 기술 스택 ---
            var techHtml = '';
            if (Array.isArray(plan.techStack) && plan.techStack.length > 0) {
                techHtml = '<div class="px-6 pb-4 flex flex-wrap gap-1.5">';
                plan.techStack.forEach(function (tech) {
                    techHtml += '<span class="inline-flex items-center rounded-full border border-outline-variant bg-surface px-2.5 py-0.5 text-label-sm text-on-surface">' + escapeHtml(tech) + '</span>';
                });
                techHtml += '</div>';
            }

            // --- 액션 바: 상세보기 + 삭제 ---
            var hasDetails = (Array.isArray(plan.features) && plan.features.length > 0) ||
                             (Array.isArray(plan.detailedSchedule) && plan.detailedSchedule.length > 0) ||
                             plan.expectedEffect;

            var actionHtml = '<div class="px-6 pb-3 flex items-center justify-between">';
            // 좌측: 상세보기 토글
            if (hasDetails) {
                actionHtml +=
                    '<button type="button" data-toggle="' + detailId + '" class="saved-detail-toggle flex items-center gap-1 text-label-md text-primary hover:underline cursor-pointer">' +
                        '<span class="material-symbols-outlined text-[16px] transition-transform duration-200">expand_more</span>' +
                        '<span>상세 보기</span>' +
                    '</button>';
            } else {
                actionHtml += '<span></span>';
            }
            // 우측: 삭제 버튼
            actionHtml +=
                '<button type="button" data-delete-id="' + plan.id + '" class="saved-delete-btn pdf-exclude flex items-center gap-1 text-label-md text-error hover:text-on-error-container cursor-pointer transition-colors">' +
                    '<span class="material-symbols-outlined text-[16px]">delete</span>' +
                    '<span>삭제</span>' +
                '</button>';

            actionHtml +=
                '<button type="button" data-pdf-id="' + plan.id + '" class="saved-pdf-btn pdf-exclude flex items-center gap-1 text-label-md text-on-surface bg-surface-container px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors">' +
                    '<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>' +
                    '<span>PDF</span>' +
                '</button>';
            actionHtml += '</div>';

            // --- 상세 영역 ---
            var detailHtml = '';
            if (hasDetails) {
                detailHtml = '<div id="' + detailId + '" class="hidden border-t border-outline-variant">';

                // 핵심 기능
                if (Array.isArray(plan.features) && plan.features.length > 0) {
                    detailHtml += '<div class="px-6 py-4">' +
                        '<h4 class="text-label-md font-label-md uppercase tracking-wider text-secondary mb-2">Key Features</h4>' +
                        '<ul class="space-y-1.5">';
                    plan.features.forEach(function (f) {
                        detailHtml += '<li class="flex items-start gap-1.5 text-body-md text-on-surface">' +
                            '<span class="material-symbols-outlined text-primary text-[16px] mt-0.5" style="font-variation-settings:\'FILL\' 1">check_circle</span>' +
                            '<span>' + escapeHtml(f) + '</span></li>';
                    });
                    detailHtml += '</ul></div>';
                }

                // 상세 일정
                if (Array.isArray(plan.detailedSchedule) && plan.detailedSchedule.length > 0) {
                    detailHtml += '<div class="px-6 py-4 border-t border-outline-variant/50">' +
                        '<h4 class="text-label-md font-label-md uppercase tracking-wider text-secondary mb-2">' +
                            '<span class="material-symbols-outlined text-[14px] align-middle mr-0.5" style="font-variation-settings:\'FILL\' 1">calendar_month</span>' +
                            'Detailed Schedule</h4>' +
                        '<ol class="space-y-1.5">';
                    plan.detailedSchedule.forEach(function (s) {
                        detailHtml += '<li class="flex items-start gap-1.5 text-body-md text-on-surface">' +
                            '<span class="material-symbols-outlined text-secondary text-[14px] mt-0.5" style="font-variation-settings:\'FILL\' 1">event_note</span>' +
                            '<span>' + escapeHtml(s) + '</span></li>';
                    });
                    detailHtml += '</ol></div>';
                }

                // 기대 효과
                if (plan.expectedEffect) {
                    detailHtml += '<div class="px-6 py-4 border-t border-outline-variant/50 bg-primary/5">' +
                        '<h4 class="text-label-md font-label-md uppercase tracking-wider text-secondary mb-2">' +
                            '<span class="material-symbols-outlined text-[14px] align-middle mr-0.5" style="font-variation-settings:\'FILL\' 1">emoji_objects</span>' +
                            'Expected Effect</h4>' +
                        '<p class="text-body-md text-on-surface-variant">' + escapeHtml(plan.expectedEffect) + '</p>' +
                    '</div>';
                }

                detailHtml += '</div>';
            }

            card.innerHTML = headerHtml + techHtml + actionHtml + detailHtml;
            listEl.appendChild(card);

            // 토글 이벤트 바인딩
            var toggleBtn = card.querySelector('[data-toggle="' + detailId + '"]');
            if (toggleBtn) {
                toggleBtn.addEventListener("click", function () {
                    var detail = document.getElementById(detailId);
                    var arrow = toggleBtn.querySelector(".material-symbols-outlined");
                    var label = toggleBtn.querySelector("span:last-child");
                    if (detail) {
                        var isHidden = detail.classList.contains("hidden");
                        detail.classList.toggle("hidden");
                        if (arrow) arrow.style.transform = isHidden ? "rotate(180deg)" : "";
                        if (label) label.textContent = isHidden ? "접기" : "상세 보기";
                    }
                });
            }

            // 삭제 버튼 이벤트 바인딩
            var deleteBtn = card.querySelector('[data-delete-id="' + plan.id + '"]');
            if (deleteBtn) {
                deleteBtn.addEventListener("click", function () {
                    if (confirm("'" + (plan.title || "이 기획안") + "'을(를) 정말 삭제하시겠습니까?")) {
                        deleteSavedPlan(plan.id);
                    }
                });
            }

            // PDF 다운로드 버튼 이벤트 바인딩
            var pdfBtn = card.querySelector('[data-pdf-id="' + plan.id + '"]');
            if (pdfBtn) {
                pdfBtn.addEventListener("click", function () {
                    var filename = "[CapGuide] " + (plan.title || "제목 없음") + ".pdf";
                    downloadPdf(card, filename);
                });
            }
        });
    }

    function openSavedPlansModal() {
        fetch("/api/plans", {
            method: "GET",
            credentials: "include"
        })
        .then(function (response) {
            if (response.status === 401) {
                showToast("로그인이 필요합니다.", "warning");
                return [];
            }
            if (!response.ok) {
                throw new Error("저장된 기획안을 불러오는 데 실패했습니다.");
            }
            return response.json();
        })
        .then(function (data) {
            renderSavedPlans(Array.isArray(data) ? data : []);
            toggleSavedPlansModal(true);
        })
        .catch(function (error) {
            console.error("Saved plans load error:", error);
            showToast("저장된 기획안을 불러오지 못했습니다.", "error");
            renderSavedPlans([]);
            toggleSavedPlansModal(true);
        });
    }

    var savedPlansBtn = document.getElementById("saved-plans-btn");
    if (savedPlansBtn) {
        savedPlansBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            openSavedPlansModal();
            toggleDropdown(false);
        });
    }

    var closeSavedPlansModalBtn = document.getElementById("close-saved-plans-modal");
    if (closeSavedPlansModalBtn) {
        closeSavedPlansModalBtn.addEventListener("click", function () {
            toggleSavedPlansModal(false);
        });
    }

    // 플랜 열람창 외부(배경) 클릭 시 닫기
    var savedPlansModal = document.getElementById("saved-plans-modal");
    if (savedPlansModal) {
        savedPlansModal.addEventListener("click", function (e) {
            // 클릭한 대상(e.target)이 모달 내부의 하얀 박스가 아니라 어두운 배경(savedPlansModal 자체)일 때만 닫기!
            if (e.target === savedPlansModal) {
                toggleSavedPlansModal(false);
            }
        });
    }

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
                    }).catch(function () {
                        return { ok: response.ok, data: { message: "서버 응답을 처리하는 중 오류가 발생했습니다." } };
                    });
                })
                .then(function (result) {
                    if (result.ok) {
                        showToast("기획안이 성공적으로 저장되었습니다!", "success");
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
                    showToast(error && error.message ? error.message : "저장 중 오류가 발생했습니다.", "error");
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                });
            });
        }

        var shareBtn = clone.querySelector('[data-action="share"]');
        if (shareBtn) {
            var actionRow = shareBtn.closest(".flex");
            if (actionRow) {
                actionRow.classList.add("pdf-exclude");

                var pdfBtn = document.createElement("button");
                pdfBtn.type = "button";
                pdfBtn.className = "flex-1 flex items-center justify-center gap-xs bg-surface-variant text-on-surface text-label-lg font-label-lg px-4 py-2.5 rounded-lg hover:bg-outline-variant transition-colors border border-outline-variant cursor-pointer pdf-exclude";
                pdfBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF';

                if (shareBtn && shareBtn.parentNode) {
                    shareBtn.parentNode.insertBefore(pdfBtn, shareBtn);
                } else if (actionRow) {
                    actionRow.appendChild(pdfBtn);
                }

                pdfBtn.addEventListener("click", function (e) {
                    var pdfTarget = pdfBtn.closest("article") || pdfBtn.closest("[class*='card']") || pdfBtn.closest("[class*='result-cards-container']") || pdfBtn.parentElement.parentElement;
                    var filename = "[CapGuide] " + (data.title || "Untitled Project") + ".pdf";
                    downloadPdf(pdfTarget, filename);
                });
            }
        }

        // Share 버튼 (Markdown 형식으로 전체 카드 데이터 클립보드 복사)

        if (shareBtn) {
            shareBtn.addEventListener("click", function () {
                var lines = [];
                lines.push("# " + (data.title || "Untitled Project"));
                lines.push("");
                if (data.background) {
                    lines.push("## 📋 Background");
                    lines.push(data.background);
                    lines.push("");
                }
                if (Array.isArray(data.features) && data.features.length > 0) {
                    lines.push("## ✅ Key Features");
                    data.features.forEach(function (f) { lines.push("- " + f); });
                    lines.push("");
                }
                if (Array.isArray(data.techStack) && data.techStack.length > 0) {
                    lines.push("## 🛠 Tech Stack");
                    lines.push(data.techStack.join(", "));
                    lines.push("");
                }
                if (Array.isArray(data.detailedSchedule) && data.detailedSchedule.length > 0) {
                    lines.push("## 📅 Detailed Schedule");
                    data.detailedSchedule.forEach(function (s, i) { lines.push((i + 1) + ". " + s); });
                    lines.push("");
                }
                if (data.expectedEffect) {
                    lines.push("## 💡 Expected Effect");
                    lines.push(data.expectedEffect);
                    lines.push("");
                }
                lines.push("---");
                lines.push("Generated by CapGuide");

                var shareText = lines.join("\n");
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(function () {
                        showToast("📋 전체 기획안이 클립보드에 복사되었습니다!", "success");
                    }).catch(function () {
                        showToast("클립보드 복사에 실패했습니다.", "error");
                    });
                } else {
                    showToast("이 브라우저에서는 클립보드 복사가 지원되지 않습니다.", "error");
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
    function resetToHome() {
        if (isFetching) return;

        if (resultSection) resultSection.style.display = "none";
        if (loadingSection) loadingSection.style.display = "none";
        if (homeSection) homeSection.style.display = "block";
        if (cardsContainer) cardsContainer.innerHTML = "";
        if (searchInput) searchInput.value = "";
        if (clearBtn) clearBtn.classList.add("hidden");
        if (placeholderEl) {
            placeholderEl.style.opacity = "1";
            placeholderEl.classList.remove("placeholder-hidden");
            placeholderEl.classList.add("placeholder-visible");
        }
        enableSearchBtn();
    }

    function performSearch(query) {
        if (isFetching) {
            console.warn("이미 검색 요청이 진행 중입니다.");
            return;
        }

        var term = query || (searchInput ? searchInput.value.trim() : "");
        if (!term) {
            if (searchInput) searchInput.focus();
            showToast("프로젝트 키워드나 주제를 입력해주세요!", "warning");
            return;
        }

        
        if (homeSection) homeSection.style.display = "none";
        if (resultSection) resultSection.style.display = "none";
        if (loadingSection) loadingSection.style.display = "block";
        if (cardsContainer) cardsContainer.innerHTML = "";
        disableSearchBtn();

        fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: term })
        })
        .then(function (response) {
            return response.json().then(function (body) {
                return { ok: response.ok, data: body };
            }).catch(function () {
                return { ok: response.ok, data: { message: "서버 응답을 처리하는 중 오류가 발생했습니다." } };
            });
        })
        .then(function (result) {
            if (result.ok) {
                
                renderAllCards(result.data);
                if (loadingSection) loadingSection.style.display = "none";
                if (resultSection) resultSection.style.display = "block";
                showToast("검색 완료!", "success");
            } else {
                if (loadingSection) loadingSection.style.display = "none";
                if (homeSection) homeSection.style.display = "block";
                showToast(result.data.message || "검색 중 오류가 발생했습니다.", "error");
            }
        })
        .catch(function (error) {
            console.error("검색 오류:", error);
            if (loadingSection) loadingSection.style.display = "none";
            if (homeSection) homeSection.style.display = "block";
            showToast(error && error.message ? error.message : "검색 중 오류가 발생했습니다.", "error");
        })
        .finally(function () {
            enableSearchBtn();
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

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            resetToHome();
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

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            performSearch();
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

    // 공통 PDF 다운로드 유틸: 대상 엘리먼트와 파일명을 받아 html2pdf로 변환
    function downloadPdf(targetElement, filename) {
        if (!targetElement || targetElement.innerText.trim() === "") {
            showToast("PDF 변환 대상이 없습니다.", "error");
            return;
        }

        var originalBg = targetElement.style.backgroundColor;
        try { targetElement.style.backgroundColor = '#ffffff'; } catch (e) {}

        showToast("PDF 다운로드를 준비 중입니다...", "info");

        var opt = {
            margin: 0.5,
            filename: filename || "[CapGuide] export.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                backgroundColor: "#ffffff",
                scrollY: 0,
                windowWidth: document.documentElement.offsetWidth,
                ignoreElements: function (element) {
                    return element.classList && element.classList.contains && element.classList.contains("pdf-exclude");
                }
            },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(targetElement).save()
            .then(function () {
                showToast("PDF 다운로드가 시작되었습니다.", "success");
            })
            .catch(function (error) {
                console.error("PDF 생성 오류:", error);
                showToast("PDF 생성 중 오류가 발생했습니다.", "error");
            }).finally(function () {
                try { targetElement.style.backgroundColor = originalBg || ''; } catch (e) {}
            });
    }
});