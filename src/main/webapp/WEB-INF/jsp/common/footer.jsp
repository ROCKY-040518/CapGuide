<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<footer class="w-full bg-surface-container-low border-t border-outline-variant flat no shadows mt-auto">
    <div class="flex flex-col md:flex-row justify-between items-center w-full py-lg px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto gap-md">
        <div class="text-label-lg font-label-lg font-bold text-on-surface">
            CapGuide
        </div>
        <div class="flex flex-wrap justify-center gap-md">
            <a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Privacy Policy</a>
            <a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Terms of Service</a>
            <a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Contact Support</a>
        </div>
        <div class="text-body-md font-body-md text-on-surface-variant">
            © 2026 CapGuide. All rights reserved.
        </div>
    </div>
</footer>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const placeholders = [
            '인문학 캡스톤 주제', 
            '드론 공학 과제', 
            'AI 활용 비즈니스 모델',
            'Computer Science Thesis'
        ];
        let currentIdx = 0;
        const placeholderEl = document.getElementById('placeholder-text');
        const searchInput = document.getElementById('keyword-input'); // 수정된 ID 매핑
        const clearBtn = document.getElementById('clear-btn');

        const togglePlaceholderVisibility = () => {
            if (!searchInput) return;
            if (searchInput.value.trim() !== '' || document.activeElement === searchInput) {
                placeholderEl.style.opacity = '0';
                clearBtn.classList.toggle('hidden', searchInput.value.trim() === '');
            } else {
                placeholderEl.style.opacity = '1';
                clearBtn.classList.add('hidden');
            }
        };

        if (searchInput) {
            searchInput.addEventListener('focus', togglePlaceholderVisibility);
            searchInput.addEventListener('blur', togglePlaceholderVisibility);
            searchInput.addEventListener('input', togglePlaceholderVisibility);
            
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.focus();
                togglePlaceholderVisibility();
            });
        }

        setInterval(() => {
            if (document.activeElement === searchInput || (searchInput && searchInput.value.trim() !== '')) return;

            placeholderEl.classList.remove('placeholder-visible');
            placeholderEl.classList.add('placeholder-hidden');
            
            setTimeout(() => {
                currentIdx = (currentIdx + 1) % placeholders.length;
                placeholderEl.textContent = placeholders[currentIdx];
                
                requestAnimationFrame(() => {
                    placeholderEl.classList.remove('placeholder-hidden');
                    placeholderEl.classList.add('placeholder-visible');
                });
            }, 500);
        }, 3000);
    });
</script>
</body>
</html>