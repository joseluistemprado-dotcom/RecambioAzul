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

    // Contact Modal
    setupModal('nav-contact', 'contact-modal', 'contact-close');

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
