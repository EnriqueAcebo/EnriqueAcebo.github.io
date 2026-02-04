// Language Switcher
(function() {
    const FLAG_SVG = {
        es: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#c60b1e"/><rect y="4" width="24" height="8" fill="#ffc400"/></svg>',
        en: '<svg viewBox="0 0 60 30" aria-hidden="true" focusable="false"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#ffffff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="4"/><path d="M30 0V30M0 15H60" stroke="#ffffff" stroke-width="10"/><path d="M30 0V30M0 15H60" stroke="#c8102e" stroke-width="6"/></svg>'
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
