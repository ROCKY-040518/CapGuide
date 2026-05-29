<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<main class="flex-grow flex flex-col items-center justify-center w-full px-4 md:px-12 max-w-[1280px] mx-auto py-20">
    
    <div class="mb-10 text-center flex flex-col items-center">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-600 tracking-tight mb-2">CapGuide</h1>
        <p class="text-base text-gray-500">The definitive search for academic capstones</p>
    </div>
    
    <div class="w-full max-w-[640px] relative">
        <form id="search-form" class="flex items-center w-full bg-white border border-gray-300 rounded-full px-6 h-[56px] transition-all duration-300 shadow-sm focus-within:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            
            <span class="material-symbols-outlined text-gray-400 mr-3">search</span>
            
            <input aria-label="Search capstone subjects" 
                   autocomplete="off" 
                   class="w-full h-full bg-transparent border-none outline-none focus:ring-0 p-0 text-lg text-gray-900 placeholder-gray-400" 
                   id="search-input" 
                   type="text"
                   placeholder="원하는 캡스톤 주제를 입력하세요 (예: AI 스마트 시스템)"/>
        </form>
    </div>
    
    <div class="flex items-center gap-3 mt-6">
        <button id="search-btn" type="submit" form="search-form" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-6 py-3 rounded-md border border-gray-300 transition-all cursor-pointer">
            Search
        </button>
        <button type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-6 py-3 rounded-md border border-gray-300 transition-all cursor-pointer">
            I'm Feeling Lucky
        </button>
    </div>
    
    <div class="flex flex-wrap justify-center gap-2 mt-8 max-w-[800px]">
        <span class="text-sm text-gray-500">Trending:</span>
        <a class="text-sm font-medium text-blue-600 hover:underline" href="#">Machine Learning</a>
        <a class="text-sm font-medium text-blue-600 hover:underline" href="#">Sustainable Energy</a>
        <a class="text-sm font-medium text-blue-600 hover:underline" href="#">Urban Design</a>
    </div>
    
</main>