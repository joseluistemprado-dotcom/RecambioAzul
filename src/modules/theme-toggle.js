export class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark'; // Default to dark
    }

    init() {
        this.applyTheme();
        this.injectToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.updateIcon();
    }

    injectToggle() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        // Create Button
        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.className = 'btn-icon';
        btn.style.marginRight = '0.5rem';
        btn.addEventListener('click', () => this.toggle());

        // Insert before Cart button or at start
        headerActions.insertBefore(btn, headerActions.firstChild);

        this.updateIcon();
    }

    updateIcon() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;

        if (this.theme === 'dark') {
            // Sun Icon for "Switch to Light"
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
            btn.title = "Cambiar a modo claro";
        } else {
            // Moon Icon for "Switch to Dark"
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
            btn.title = "Cambiar a modo oscuro";
        }
    }
}
