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
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-gutter">
        
        <article class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-md relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-fixed opacity-80"></div>
            
            <header>
                <h2 id="res-title" class="text-headline-md font-headline-md text-on-surface mb-xs">
                    AI-based Smart Waste Management
                </h2>
                <p id="res-background" class="text-body-md font-body-md text-on-surface-variant">
                    Urban areas struggle with inefficient waste collection routes leading to overflowing bins and high operational costs. This project proposes an intelligent system to optimize collection schedules dynamically.
                </p>
            </header>
            
            <section class="bg-surface-container-low rounded-lg p-sm">
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">Key Features</h3>
                <ul class="space-y-2">
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">location_on</span>
                        <span>Real-time bin level tracking</span>
                    </li>
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">route</span>
                        <span>Predictive collection route analytics</span>
                    </li>
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">eco</span>
                        <span>Citizen recycling reward system</span>
                    </li>
                </ul>
            </section>
            
            <section>
                <div class="flex flex-wrap gap-xs">
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">Python</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">TensorFlow</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">React Native</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">Firebase</span>
                </div>
            </section>
            
            <footer class="mt-auto pt-sm border-t border-outline-variant">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-label-md font-label-md text-secondary">Estimated Timeline</span>
                    <span class="text-label-md font-label-md text-primary font-bold">4 Weeks</span>
                </div>
                <div class="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex">
                    <div class="bg-primary h-full w-1/4 rounded-l-full relative group-hover:opacity-90"></div>
                    <div class="bg-primary-fixed-dim h-full w-1/4 border-l border-surface-container-lowest"></div>
                    <div class="bg-primary-fixed-dim h-full w-1/4 border-l border-surface-container-lowest"></div>
                    <div class="bg-primary-fixed-dim h-full w-1/4 border-l border-surface-container-lowest"></div>
                </div>
                <div class="flex justify-between mt-1 px-1">
                    <span class="text-[10px] text-on-surface-variant">Research</span>
                    <span class="text-[10px] text-on-surface-variant">Model</span>
                    <span class="text-[10px] text-on-surface-variant">Dev</span>
                    <span class="text-[10px] text-on-surface-variant">Test</span>
                </div>
            </footer>
        </article>
        
        <article class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-md relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary to-tertiary-fixed opacity-80"></div>
            <header>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-xs">Predictive Urban Traffic Flow</h2>
                <p class="text-body-md font-body-md text-on-surface-variant">Traffic congestion causes massive economic and environmental losses. This project uses machine learning on existing camera feeds to predict bottlenecks before they occur.</p>
            </header>
            <section class="bg-surface-container-low rounded-lg p-sm">
                <h3 class="text-label-md font-label-md text-on-surface mb-xs uppercase tracking-wider text-secondary">Key Features</h3>
                <ul class="space-y-2">
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">videocam</span>
                        <span>Computer vision for vehicle counting</span>
                    </li>
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">query_stats</span>
                        <span>Time-series congestion forecasting</span>
                    </li>
                    <li class="flex items-start gap-xs text-body-md font-body-md text-on-surface">
                        <span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5" style="font-variation-settings: 'FILL' 1;">dashboard</span>
                        <span>Interactive city planner dashboard</span>
                    </li>
                </ul>
            </section>
            <section>
                <div class="flex flex-wrap gap-xs">
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">OpenCV</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">PyTorch</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">Vue.js</span>
                    <span class="bg-surface-variant text-on-surface text-label-md font-label-md px-3 py-1 rounded-full border border-outline-variant">PostgreSQL</span>
                </div>
            </section>
            <footer class="mt-auto pt-sm border-t border-outline-variant">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-label-md font-label-md text-secondary">Estimated Timeline</span>
                    <span class="text-label-md font-label-md text-tertiary font-bold">5 Weeks</span>
                </div>
                <div class="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex">
                    <div class="bg-tertiary h-full w-[20%] rounded-l-full"></div>
                    <div class="bg-tertiary-fixed-dim h-full w-[20%] border-l border-surface-container-lowest"></div>
                    <div class="bg-tertiary-fixed-dim h-full w-[20%] border-l border-surface-container-lowest"></div>
                    <div class="bg-tertiary-fixed-dim h-full w-[20%] border-l border-surface-container-lowest"></div>
                    <div class="bg-tertiary-fixed-dim h-full w-[20%] border-l border-surface-container-lowest"></div>
                </div>
            </footer>
        </article>
        
    </div>
</main>