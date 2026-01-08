export function showView(viewId, path = null, data = null) {
    console.log('Switching to view:', viewId, 'Path:', path);

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
        const currentState = history.state;
        const normalizedPath = path || (viewId === 'view-home' ? '/' : null);

        if (normalizedPath && window.location.pathname !== normalizedPath) {
            history.pushState({ view: viewId, data: data }, "", normalizedPath);
        } else if (!normalizedPath && currentState?.view !== viewId) {
            history.pushState({ view: viewId, data: data }, "");
        }
    }
}

export function handleRouting() {
    const path = window.location.pathname;
    console.log('Handling routing for path:', path);

    if (path === '/' || path === '/index.html') {
        showView('view-home');
        return;
    }

    const segments = path.split('/').filter(Boolean);

    if (segments[0] === 'pieza' && segments[1]) {
        // Dispatch event to load product by ID
        document.dispatchEvent(new CustomEvent('load-product-by-id', { detail: segments[1] }));
    } else if (segments[0] === 'vehiculo' && segments[1]) {
        // Dispatch event to load vehicle by ID
        document.dispatchEvent(new CustomEvent('load-vehicle-by-id', { detail: segments[1] }));
    } else if (segments[0] === 'categoria' && segments[1]) {
        // Dispatch event to filter current view by category
        showView('view-home');
        document.dispatchEvent(new CustomEvent('load-category', { detail: segments[1] }));
    } else if (segments[0] === 'vehiculos') {
        showView('view-donor-vehicles', '/vehiculos');
    } else if (segments[0] === 'cliente') {
        showView('view-client-area', '/cliente');
    } else if (segments[0] === 'vender') {
        showView('view-sell-car', '/vender');
    } else if (segments[0] === 'contacto') {
        showView('view-contact', '/contacto');
    } else if (segments[0] === 'carrito') {
        showView('view-cart', '/carrito');
    } else {
        showView('view-home', '/');
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
    setupView('nav-donor-vehicles', 'view-donor-vehicles', '/vehiculos');
    setupView('nav-sell-car', 'view-sell-car', '/vender');
    setupView('footer-sell-car', 'view-sell-car', '/vender');
    setupView('nav-contact', 'view-contact', '/contacto');

    // Quick link for cart
    const cartToggle = document.getElementById('cart-toggle-btn');
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            showView('view-cart', '/carrito');
        });
    }

    // Home links/buttons
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home', '/'));
    });

    // Custom back buttons for specific nested flows
    document.querySelectorAll('.btn-back-donors').forEach(btn => {
        btn.addEventListener('click', () => showView('view-donor-vehicles', '/vehiculos'));
    });

    document.querySelectorAll('.btn-back-catalog').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home', '/'));
    });

    // History API - Support for Back Button
    window.addEventListener('popstate', (e) => {
        handleRouting();

        // Always close cart sidebar/overlay if any (backward compatibility)
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

function setupView(triggerId, viewId, path) {
    const trigger = document.getElementById(triggerId);
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            showView(viewId, path);
        });
    }
}
