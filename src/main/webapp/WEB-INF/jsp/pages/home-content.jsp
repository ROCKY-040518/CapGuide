<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<main class="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
    <div class="mb-xl text-center flex flex-col items-center">
        <h1 class="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight mb-xs">CapGuide</h1>
        <p class="text-body-md font-body-md text-secondary">The definitive search for academic capstones</p>
    </div>
    
    <div class="w-full max-w-[640px] relative group">
        <form id="search-form" class="flex items-center w-full bg-surface-container-lowest border border-outline-variant rounded-full px-lg h-[56px] transition-shadow duration-300 shadow-sm hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] focus-within:shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] focus-within:border-primary">
            <span class="material-symbols-outlined text-outline mr-sm">search</span>
            <div class="relative flex-grow h-full flex items-center">
                <div class="absolute left-0 text-body-lg font-body-lg text-outline pointer-events-none placeholder-transition placeholder-visible w-full truncate" id="placeholder-text">
                    인문학 캡스톤 주제
                </div>
                <input aria-label="Search capstone subjects" autocomplete="off" class="w-full h-full bg-transparent border-none outline-none focus:ring-0 p-0 text-body-lg font-body-lg text-on-surface" id="keyword-input" type="text"/>
            </div>
            <button type="button" aria-label="Clear search" class="hidden text-outline hover:text-on-surface ml-sm p-1 rounded-full" id="clear-btn">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </form>
    </div>
    
    <div class="flex items-center gap-sm mt-lg">
        <button type="submit" form="search-form" class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-lg font-label-lg px-lg py-sm rounded border border-transparent hover:border-outline-variant transition-all">
            Search
        </button>
        <button type="button" class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-lg font-label-lg px-lg py-sm rounded border border-transparent hover:border-outline-variant transition-all">
            I'm Feeling Lucky
        </button>
    </div>
    
    <div class="flex flex-wrap justify-center gap-sm mt-xl max-w-[800px]">
        <span class="text-label-md font-label-md text-secondary">Trending:</span>
        <a class="text-label-md font-label-md text-primary hover:underline" href="#">Machine Learning</a>
        <a class="text-label-md font-label-md text-primary hover:underline" href="#">Sustainable Energy</a>
        <a class="text-label-md font-label-md text-primary hover:underline" href="#">Urban Design</a>
    </div>
</main>