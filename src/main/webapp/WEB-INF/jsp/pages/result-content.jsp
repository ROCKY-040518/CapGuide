<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<main class="flex-1 w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto py-xl">
    
    <header class="mb-xl">
        <h1 class="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs">
            Recommended Projects
        </h1>
        <p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            Based on your interests, we've curated these high-impact capstone project topics for you.
        </p>
    </header>
    
    <!-- 카드들이 동적으로 채워지는 컨테이너 -->
    <div id="result-cards-container" class="grid grid-cols-1 gap-gutter max-w-2xl mx-auto">
    </div>

    <!-- 카드 템플릿: JS에서 복제(clone)하여 사용 -->
    <template id="card-template">
        <article class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-md relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-fixed opacity-80"></div>
            
            <!-- 제목 & 배경 -->
            <header>
                <h2 data-field="title" class="text-headline-md font-headline-md text-on-surface mb-xs"></h2>
                <p data-field="background" class="text-body-md font-body-md text-on-surface-variant"></p>
            </header>
            
            <!-- 핵심 기능 -->
            <section class="bg-surface-container-low rounded-lg p-sm">
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">Key Features</h3>
                <ul data-field="features" class="space-y-2">
                </ul>
            </section>
            
            <!-- 기술 스택 -->
            <section>
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">Tech Stack</h3>
                <div data-field="techStack" class="flex flex-wrap gap-xs">
                </div>
            </section>

            <!-- 주차별 상세 일정 -->
            <section class="bg-surface-container-low rounded-lg p-sm">
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">
                    <span class="material-symbols-outlined text-[16px] align-middle mr-1" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
                    Detailed Schedule
                </h3>
                <ol data-field="detailedSchedule" class="space-y-1.5 list-none pl-0">
                </ol>
            </section>

            <!-- 기대 효과 -->
            <section class="bg-primary/5 rounded-lg p-sm border border-primary/10">
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">
                    <span class="material-symbols-outlined text-[16px] align-middle mr-1" style="font-variation-settings: 'FILL' 1;">emoji_objects</span>
                    Expected Effect
                </h3>
                <p data-field="expectedEffect" class="text-body-md font-body-md text-on-surface-variant"></p>
            </section>

            <!-- 저장 & 공유 버튼 -->
            <div class="flex gap-sm pt-sm border-t border-outline-variant">
                <button type="button" data-action="save" class="flex-1 flex items-center justify-center gap-xs bg-primary text-on-primary text-label-lg font-label-lg px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">bookmark</span>
                    Save
                </button>
                <button type="button" data-action="share" class="flex-1 flex items-center justify-center gap-xs bg-surface-variant text-on-surface text-label-lg font-label-lg px-4 py-2.5 rounded-lg hover:bg-outline-variant transition-colors border border-outline-variant cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">share</span>
                    Share
                </button>
            </div>
        </article>
    </template>

</main>