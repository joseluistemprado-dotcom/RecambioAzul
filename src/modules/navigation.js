export function initNavigation() {
    // Scroll handling for anchor links if any
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sell Car Modal
    setupModal('nav-sell-car', 'sell-car-modal', 'sell-car-close');
    setupModal('footer-sell-car', 'sell-car-modal', 'sell-car-close');

    // Contact Modal
    setupModal('nav-contact', 'contact-modal', 'contact-close');

    // History API - Support for Back Button on Modals
    window.addEventListener('popstate', (e) => {
        const activeModals = document.querySelectorAll('.modal-overlay.active, .cart-sidebar.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            const overlay = document.getElementById('cart-overlay');
            if (overlay) overlay.classList.remove('active');
        });

        // Restore main content if checkout was active
        const checkout = document.getElementById('checkout-section');
        if (checkout && !checkout.classList.contains('hidden')) {
            checkout.classList.add('hidden');
            const mainContent = document.querySelector('main.container');
            if (mainContent) mainContent.style.display = 'block';
        }
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

function setupModal(triggerId, modalId, closeId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);

    if (trigger && modal) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            history.pushState({ modal: modalId }, "");
        });
    }

    if (close && modal) {
        close.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}
