// Internal helper to just toggle classes without changing history/hash
function switchViewDOM(viewId) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
        // Dispatch event for lazy initialization
        document.dispatchEvent(new CustomEvent('view-shown', { detail: viewId }));
    }
}

export function showView(viewId, path = null, data = null) {
    console.log('showView targeting:', viewId, 'with path:', path);
    switchViewDOM(viewId);

    if (path) {
        // Prepare new hash (ensure it starts with #/)
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const newHash = `#${normalizedPath}`;

        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
        }
    } else if (viewId === 'view-home') {
        if (window.location.hash !== '' && window.location.hash !== '#/') {
            window.location.hash = '#/';
        }
    }
}

export function handleRouting() {
    const hash = window.location.hash || '#/';
    const path = hash.replace(/^#/, '');
    console.log('handleRouting processing path:', path);

    if (path === '/' || path === '' || path === '/index.html') {
        switchViewDOM('view-home');
        return;
    }

    const segments = path.split('/').filter(Boolean);

    if (segments[0] === 'pieza' && segments[1]) {
        switchViewDOM('view-product-details');
        document.dispatchEvent(new CustomEvent('load-product-by-id', { detail: segments[1] }));
    } else if (segments[0] === 'vehiculo' && segments[1]) {
        switchViewDOM('view-donor-details');
        document.dispatchEvent(new CustomEvent('load-vehicle-by-id', { detail: segments[1] }));
    } else if (segments[0] === 'categoria' && segments[1]) {
        switchViewDOM('view-home');
        document.dispatchEvent(new CustomEvent('load-category', { detail: segments[1] }));
    } else if (segments[0] === 'vehiculos') {
        switchViewDOM('view-donor-vehicles');
    } else if (segments[0] === 'cliente') {
        switchViewDOM('view-client-area');
    } else if (segments[0] === 'vender') {
        switchViewDOM('view-sell-car');
    } else if (segments[0] === 'contacto') {
        switchViewDOM('view-contact');
    } else if (segments[0] === 'diagnostico') {
        switchViewDOM('view-diagnostic-wizard');
    } else if (segments[0] === 'carrito') {
        switchViewDOM('view-cart');
    } else {
        switchViewDOM('view-home');
    }
}

export function initNavigation() {
    // Scroll handling for anchor links (EXCLUDING routes like #/)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#/')) return; // Let routing handle this

            e.preventDefault();
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // View Transitions
    setupView('nav-donor-vehicles', 'view-donor-vehicles', 'vehiculos');
    setupView('nav-sell-car', 'view-sell-car', 'vender');
    setupView('footer-sell-car', 'view-sell-car', 'vender');
    setupView('nav-contact', 'view-contact', 'contacto');

    // Global Search Parts link (needs to go home first)
    const searchPartsBtn = document.getElementById('nav-search-parts');
    if (searchPartsBtn) {
        searchPartsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('view-home', '/');
            setTimeout(() => {
                const target = document.getElementById('vehicle-selector-container');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }

    // Quick link for cart
    const cartToggle = document.getElementById('cart-toggle-btn');
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            showView('view-cart', 'carrito');
        });
    }

    // Home links/buttons
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home', '/'));
    });

    // Custom back buttons for specific nested flows
    document.querySelectorAll('.btn-back-donors').forEach(btn => {
        btn.addEventListener('click', () => showView('view-donor-vehicles', 'vehiculos'));
    });

    document.querySelectorAll('.btn-back-catalog').forEach(btn => {
        btn.addEventListener('click', () => showView('view-home', '/'));
    });

    // Hash Routing support
    window.addEventListener('hashchange', () => {
        handleRouting();
    });

    // Fallback for back button if it uses history.back()
    window.addEventListener('popstate', () => {
        handleRouting();
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
