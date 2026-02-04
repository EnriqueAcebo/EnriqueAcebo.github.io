// Language Switcher
(function() {
    // Get saved language or default to English
    const savedLang = localStorage.getItem('lang') || 'en';

    // Apply language on page load
    document.addEventListener('DOMContentLoaded', function() {
        setLanguage(savedLang);

        // Set up button listeners
        const btnEn = document.getElementById('lang-en');
        const btnEs = document.getElementById('lang-es');

        if (btnEn && btnEs) {
            btnEn.addEventListener('click', () => setLanguage('en'));
            btnEs.addEventListener('click', () => setLanguage('es'));
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
