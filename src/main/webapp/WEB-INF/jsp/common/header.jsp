<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>CapGuide - Search</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    
    <script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                    "surface-container-high": "#e9e7eb",
                    "surface-container": "#efedf1",
                    "on-secondary": "#ffffff",
                    "surface-tint": "#005bc0",
                    "on-secondary-fixed-variant": "#454748",
                    "tertiary-container": "#6f7783",
                    "on-surface": "#1a1b1e",
                    "primary": "#005bbf",
                    "surface-bright": "#faf9fd",
                    "on-tertiary-fixed-variant": "#3f4752",
                    "surface-container-low": "#f4f3f7",
                    "tertiary-fixed-dim": "#bfc7d4",
                    "on-surface-variant": "#414754",
                    "surface-dim": "#dbd9dd",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-fixed-variant": "#004493",
                    "primary-fixed": "#d8e2ff",
                    "outline": "#727785",
                    "primary-fixed-dim": "#adc7ff",
                    "on-background": "#1a1b1e",
                    "inverse-on-surface": "#f1f0f4",
                    "secondary-container": "#e1e3e4",
                    "on-secondary-container": "#626566",
                    "inverse-primary": "#adc7ff",
                    "tertiary": "#565e6a",
                    "secondary": "#5c5f60",
                    "on-primary-container": "#ffffff",
                    "error-container": "#ffdad6",
                    "surface": "#faf9fd",
                    "secondary-fixed-dim": "#c5c7c8",
                    "secondary-fixed": "#e1e3e4",
                    "inverse-surface": "#2f3033",
                    "error": "#ba1a1a",
                    "background": "#faf9fd",
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed": "#dbe3f1",
                    "primary-container": "#1a73e8",
                    "outline-variant": "#c1c6d6",
                    "on-error-container": "#93000a",
                    "on-primary": "#ffffff",
                    "on-tertiary-container": "#ffffff",
                    "on-primary-fixed": "#001a41",
                    "on-secondary-fixed": "#191c1d",
                    "surface-variant": "#e3e2e6",
                    "surface-container-highest": "#e3e2e6",
                    "on-error": "#ffffff",
                    "on-tertiary-fixed": "#141c26"
              },
              "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
              },
              "spacing": {
                    "xs": "4px",
                    "sm": "12px",
                    "base": "8px",
                    "margin-mobile": "16px",
                    "lg": "24px",
                    "md": "16px",
                    "margin-desktop": "48px",
                    "gutter": "24px",
                    "xl": "32px"
              },
              "fontFamily": {
                    "label-lg": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "headline-md": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "headline-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "body-lg": ["Inter"]
              },
              "fontSize": {
                    "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.1px", "fontWeight": "500"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-md": ["22px", {"lineHeight": "28px", "fontWeight": "500"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "500"}],
                    "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.5px", "fontWeight": "500"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
              }
            }
          }
        }
    </script>
    <link rel="stylesheet" href="/css/stitch-main.css">
    <style>
        /* Toast Animation */
        @keyframes toast-slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes toast-slide-out {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .toast-enter {
            animation: toast-slide-in 0.3s ease-out forwards;
        }
        .toast-exit {
            animation: toast-slide-out 0.3s ease-in forwards;
        }
        
        /* Placeholder Animation */
        .placeholder-transition {
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
        .placeholder-hidden {
            opacity: 0;
            transform: translateY(-10px);
        }
        .placeholder-visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
    <script src="/js/stitch-action.js" defer></script>
</head>
<body class="bg-surface min-h-screen flex flex-col font-sans text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed relative">

<!-- Toast Container (전역 알림) -->
<div aria-live="polite" class="fixed bottom-lg right-lg z-50 flex flex-col gap-sm" id="toast-container"></div>

<!-- Saved Plans Modal -->
<div id="saved-plans-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/30 px-4 py-8">
    <div class="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-surface shadow-2xl ring-1 ring-black/5">
        <div class="flex items-center justify-between gap-4 p-6 pb-4 border-b border-outline-variant shrink-0">
            <div>
                <p class="text-label-lg font-semibold text-on-surface">My Saved Plans</p>
                <p class="text-body-md text-on-surface-variant">최근 저장된 기획안을 확인하고 관리하세요.</p>
            </div>
            <button id="close-saved-plans-modal" class="rounded-full bg-surface-container px-3 py-2 text-secondary hover:bg-surface-container-high transition">닫기</button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 pt-4">
            <div class="grid gap-4" id="saved-plans-list">
                <div class="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-body-md text-secondary">
                    저장된 기획안이 없습니다.
                </div>
            </div>
        </div>
    </div>
</div>

<header class="w-full bg-surface border-b border-outline-variant flat no shadows">
    <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto h-16">
        <div class="flex items-center gap-md">
            <a class="text-headline-sm font-headline-sm font-bold text-primary" href="#">CapGuide</a>
        </div>
        <nav class="hidden md:flex items-center gap-lg">
            <a aria-label="Explore Capstones" class="coming-soon-link text-label-md font-label-md text-primary border-b-2 border-primary pb-1 opacity-80 transition-opacity hover:opacity-100" href="#">Explore</a>
            <a aria-label="About CapGuide" class="coming-soon-link text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">About</a>
            <a aria-label="Resources" class="coming-soon-link text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Resources</a>
        </nav>
        <div class="flex items-center gap-sm text-secondary">
            <button aria-label="Notifications" class="coming-soon-btn p-2 rounded-full hover:bg-surface-variant transition-colors">
                <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <button aria-label="Settings" class="coming-soon-btn p-2 rounded-full hover:bg-surface-variant transition-colors">
                <span class="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
            <!-- 프로필 드롭다운 -->
            <div class="relative ml-2">
                <button aria-expanded="false" aria-haspopup="true" aria-label="Toggle user menu" class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg overflow-hidden ring-2 ring-transparent hover:ring-primary-fixed transition-all" id="profile-btn">
                    <span class="material-symbols-outlined text-[20px]" data-icon="person" id="profile-icon">person</span>
                    <span class="hidden text-sm font-bold" id="profile-initial">JD</span>
                </button>
                <!-- Dropdown Menu -->
                <div class="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg hidden opacity-0 transition-opacity duration-200 z-50" id="profile-dropdown">
                    <div class="p-4 border-b border-outline-variant">
                        <p class="text-label-lg font-bold text-on-surface" id="dropdown-username">Guest</p>
                        <p class="text-body-md text-on-surface-variant" id="dropdown-email">로그인 필요</p>
                    </div>
                    <div class="p-2 space-y-2">
                        <button id="saved-plans-btn" class="w-full text-left px-4 py-2 text-label-lg text-on-surface hover:bg-surface-variant rounded transition-colors">My Saved Plans</button>
                        <button aria-label="Log out" class="w-full text-left px-4 py-2 text-label-lg text-error hover:bg-error-container hover:text-on-error-container rounded transition-colors" id="logout-btn">
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- 로그인/회원가입 모달 -->
<div id="auth-modal" class="fixed inset-0 z-50 hidden bg-black/30 flex items-center justify-center transition-all">
    <div class="bg-surface rounded-xl shadow-lg p-lg w-96 max-w-[90vw] relative">
        <!-- 모달 닫기 버튼 -->
        <button id="close-auth-modal" class="absolute top-4 right-4 p-1 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
            <span class="material-symbols-outlined">close</span>
        </button>

        <!-- 탭 네비게이션 -->
        <div class="flex gap-sm mb-lg border-b border-outline-variant">
            <button id="login-tab" class="pb-3 px-1 text-label-md font-label-md text-primary border-b-2 border-primary transition-all">로그인</button>
            <button id="signup-tab" class="pb-3 px-1 text-label-md font-label-md text-secondary hover:text-primary transition-all">회원가입</button>
        </div>

        <!-- 로그인 폼 -->
        <div id="login-form" class="space-y-md">
            <h2 class="text-headline-md font-headline-md text-on-surface mb-lg">로그인</h2>
            <input id="login-email" type="email" placeholder="이메일" class="w-full px-md py-sm border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body-md">
            <input id="login-password" type="password" placeholder="비밀번호" class="w-full px-md py-sm border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body-md">
            <button id="login-submit" class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg transition-opacity hover:opacity-90">로그인</button>
            <div id="login-error" class="text-error text-body-md hidden"></div>
        </div>

        <!-- 회원가입 폼 -->
        <div id="signup-form" class="space-y-md hidden">
            <h2 class="text-headline-md font-headline-md text-on-surface mb-lg">회원가입</h2>
            <input id="signup-email" type="email" placeholder="이메일" class="w-full px-md py-sm border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body-md">
            <input id="signup-password" type="password" placeholder="비밀번호" class="w-full px-md py-sm border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body-md">
            <input id="signup-nickname" type="text" placeholder="닉네임" class="w-full px-md py-sm border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-body-md">
            <button id="signup-submit" class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg transition-opacity hover:opacity-90">회원가입</button>
            <div id="signup-error" class="text-error text-body-md hidden"></div>
        </div>
    </div>
</div>