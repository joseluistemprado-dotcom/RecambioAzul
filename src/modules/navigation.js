export function showView(viewId) {
    console.log('Switching to view:', viewId);

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0); // Reset scroll

        // Push state for history (back button support)
        if (history.state?.view !== viewId) {
            history.pushState({ view: viewId }, "");
        }
    }
}

export function initNavigation() {
    // Scroll handling for anchor links if any
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // View Transitions
    setupView('nav-donor-vehicles', 'view-donor-vehicles');
    setupView('nav-sell-car', 'view-sell-car');
    setupView('footer-sell-car', 'view-sell-car');
    setupView('nav-contact', 'view-contact');

    // Home links/buttons
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home'));
    });

    // Custom back buttons for specific nested flows
    document.querySelectorAll('.btn-back-donors').forEach(btn => {
        btn.addEventListener('click', () => showView('view-donor-vehicles'));
    });

    document.querySelectorAll('.btn-back-catalog').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home'));
    });

    // History API - Support for Back Button
    window.addEventListener('popstate', (e) => {
        // If state has a view, show it
        if (e.state && e.state.view) {
            const views = document.querySelectorAll('.page-view');
            views.forEach(v => v.classList.add('hidden'));
            const target = document.getElementById(e.state.view);
            if (target) target.classList.remove('hidden');
        } else {
            // Default to home
            showView('view-home');
        }

        // Always close cart sidebar on any history change
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    console.log('Navigation Initialized');
}

function setupView(triggerId, viewId) {
    const trigger = document.getElementById(triggerId);
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            showView(viewId);
        });
    }
}
