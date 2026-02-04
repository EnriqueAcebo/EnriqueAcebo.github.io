// Language Switcher
(function() {
    const FLAG_SVG = {
        es: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#c60b1e"/><rect y="4" width="24" height="8" fill="#ffc400"/></svg>',
        gb: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#012169"/><path d="M0 0 L10 0 L24 9.3 L24 16 L14 16 L0 6.7 Z" fill="#ffffff"/><path d="M24 0 L14 0 L0 9.3 L0 16 L10 16 L24 6.7 Z" fill="#ffffff"/><path d="M0 0 L4.5 0 L24 12.8 L24 16 L19.5 16 L0 3.2 Z" fill="#c8102e"/><path d="M24 0 L19.5 0 L0 12.8 L0 16 L4.5 16 L24 3.2 Z" fill="#c8102e"/><rect y="6" width="24" height="4" fill="#ffffff"/><rect x="10" width="4" height="16" fill="#ffffff"/><rect y="6.8" width="24" height="2.4" fill="#c8102e"/><rect x="10.8" width="2.4" height="16" fill="#c8102e"/></svg>'
    };

    // Get saved language or default to English
    const savedLang = localStorage.getItem('lang') || 'en';

    // Apply language on page load
    document.addEventListener('DOMContentLoaded', function() {
        setLanguage(savedLang);

        // Set up button listeners
        const btnEn = document.getElementById('lang-en');
        const btnEs = document.getElementById('lang-es');
        const toggleBtn = document.getElementById('lang-toggle');

        if (btnEn && btnEs) {
            btnEn.addEventListener('click', () => setLanguage('en'));
            btnEs.addEventListener('click', () => setLanguage('es'));
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const currentLang = localStorage.getItem('lang') || 'en';
                setLanguage(currentLang === 'en' ? 'es' : 'en');
            });
        }
    });

    function setLanguage(lang) {
        // Save preference
        localStorage.setItem('lang', lang);

        // Update button states
        const btnEn = document.getElementById('lang-en');
        const btnEs = document.getElementById('lang-es');

        if (btnEn && btnEs) {
            btnEn.classList.toggle('active', lang === 'en');
            btnEs.classList.toggle('active', lang === 'es');
        }

        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            const nextLang = lang === 'en' ? 'es' : 'en';
            const label = nextLang === 'es' ? 'Cambiar a español' : 'Switch to English';
            toggleBtn.innerHTML = FLAG_SVG[nextLang];
            toggleBtn.setAttribute('aria-label', label);
            toggleBtn.setAttribute('title', label);
        }

        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(el => {
            if (lang === 'en') {
                el.innerHTML = el.getAttribute('data-en');
            } else {
                el.innerHTML = el.getAttribute('data-es') || el.getAttribute('data-en');
            }
        });

        // Update input placeholders
        document.querySelectorAll('[data-placeholder-en]').forEach(el => {
            if (lang === 'en') {
                el.placeholder = el.getAttribute('data-placeholder-en');
            } else {
                el.placeholder = el.getAttribute('data-placeholder-es') || el.getAttribute('data-placeholder-en');
            }
        });

        // Update page title if defined
        const titleEl = document.querySelector('title[data-en]');
        if (titleEl) {
            if (lang === 'en') {
                document.title = titleEl.getAttribute('data-en');
            } else {
                document.title = titleEl.getAttribute('data-es') || titleEl.getAttribute('data-en');
            }
        }
    }

    // Expose function globally
    window.setLanguage = setLanguage;
})();
