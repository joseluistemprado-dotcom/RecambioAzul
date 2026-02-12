export class Checkout {
    constructor() {
        this.checkoutSection = null;
        this.mainSection = null;
        this.cart = null; // To clear cart on success
    }

    init(cartInstance) {
        this.checkoutSection = document.getElementById('checkout-section');
        this.mainSection = document.querySelector('main');
        this.cart = cartInstance;

        this.attachEvents();
        console.log('Checkout Module Initialized');
    }

    attachEvents() {
        document.addEventListener('checkout-start', () => {
            this.show();
        });

        const cancelBtn = document.getElementById('checkout-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
            });
        }

        const form = document.querySelector('.checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    show() {
        if (!this.checkoutSection || !this.mainSection) return;

        this.updateOrderSummary();
        this.mainSection.style.display = 'none';
        this.checkoutSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    hide() {
        if (!this.checkoutSection || !this.mainSection) return;

        this.checkoutSection.classList.add('hidden');
        this.mainSection.style.display = 'block';
        window.scrollTo(0, 0);
    }

    updateOrderSummary() {
        const container = document.getElementById('order-items-summary');
        const countSpan = document.getElementById('order-count');
        const totalSpan = document.getElementById('order-total');

        if (!this.cart) return;

        // Render mini items
        if (container) {
            container.innerHTML = this.cart.items.map(item => `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span class="summary-price">${item.price} €</span>
                </div>
            `).join('');
        }

        if (countSpan) countSpan.textContent = this.cart.items.length;
        if (totalSpan) totalSpan.textContent = `${this.cart.total.toFixed(2)} €`;
    }

    handleSubmit(e) {
        e.preventDefault();

        // Simulate processing
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Procesando...';
        btn.disabled = true;

        setTimeout(() => {
            alert('¡Pedido realizado con éxito! Gracias por confiar en Recambio Azul.');

            // Reset
            btn.textContent = originalText;
            btn.disabled = false;

            // Clear cart
            if (this.cart) {
                this.cart.items = [];
                this.cart.save();
                this.cart.render();
            }

            // Return to home
            this.hide();
        }, 1500);
    }
}
