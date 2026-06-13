<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<main class="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto py-xl">
    
    <!-- 브랜드 섹션 -->
    <div class="mb-xl text-center flex flex-col items-center">
        <h1 class="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight mb-xs">CapGuide</h1>
        <p class="text-body-md font-body-md text-secondary">The definitive search for academic capstones</p>
    </div>
    
    <!-- 검색창 -->
    <div class="w-full max-w-[640px] relative group">
        <form id="search-form" class="flex items-center w-full bg-surface-container-lowest border border-outline-variant rounded-full px-lg h-[56px] transition-shadow duration-300 shadow-sm hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] focus-within:shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] focus-within:border-primary">
            <span aria-hidden="true" class="material-symbols-outlined text-outline mr-sm">search</span>
            <div class="relative flex-grow h-full flex items-center">
                <!-- 롤링 플레이스홀더 -->
                <div aria-hidden="true" class="absolute left-0 text-body-lg font-body-lg text-outline pointer-events-none placeholder-transition placeholder-visible w-full truncate" id="placeholder-text">
                    인문학 캡스톤 주제
                </div>
                <!-- 검색 입력창 -->
                <input aria-label="Search capstone subjects" 
                       autocomplete="off" 
                       class="w-full h-full bg-transparent border-none outline-none focus:ring-0 p-0 text-body-lg font-body-lg text-on-surface" 
                       id="search-input" 
                       placeholder="" 
                       type="text"/>
            </div>
            <!-- 초기화 버튼 -->
            <button aria-label="Clear search input" type="button" class="hidden text-outline hover:text-on-surface ml-sm p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50" id="clear-btn">
                <span aria-hidden="true" class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </form>
    </div>
    
    <!-- 액션 버튼 -->
    <div class="flex items-center gap-sm mt-lg">
        <button aria-label="Execute Search" type="button" class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-lg font-label-lg px-lg py-sm rounded border border-transparent hover:border-outline-variant transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50" id="search-btn">
            Search
        </button>
        <button aria-label="I'm Feeling Lucky Search" type="button" class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-lg font-label-lg px-lg py-sm rounded border border-transparent hover:border-outline-variant transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50" id="lucky-btn">
            I'm Feeling Lucky
        </button>
    </div>
    
    <!-- Trending 링크 -->
    <div class="flex flex-wrap justify-center gap-sm mt-xl max-w-[800px]">
        <span class="text-label-md font-label-md text-secondary">Trending:</span>
        <button aria-label="Search trending topic: Machine Learning" type="button" class="trending-link text-label-md font-label-md text-primary hover:underline focus:outline-none focus:underline" data-topic="Machine Learning">Machine Learning</button>
        <button aria-label="Search trending topic: Sustainable Energy" type="button" class="trending-link text-label-md font-label-md text-primary hover:underline focus:outline-none focus:underline" data-topic="Sustainable Energy">Sustainable Energy</button>
        <button aria-label="Search trending topic: Urban Design" type="button" class="trending-link text-label-md font-label-md text-primary hover:underline focus:outline-none focus:underline" data-topic="Urban Design">Urban Design</button>
    </div>
    
</main>