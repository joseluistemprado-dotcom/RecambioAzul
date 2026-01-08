import { showView } from './navigation.js';

export class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.storageKey = 'recambio_azul_cart';
    }

    init() {
        this.load();
        this.render();
        this.attachGlobalEvents();
        console.log('Cart Initialized');
    }

    attachGlobalEvents() {
        // Listen for "add-to-cart" events
        document.addEventListener('add-to-cart', (e) => {
            this.addItem(e.detail);
        });

        // Cart toggle button (in header) now acts as a view switch
        const cartBtn = document.getElementById('cart-toggle-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showView('view-cart');
            });
        }

        // Listen for internal checkout trigger
        document.addEventListener('checkout-start', () => {
            showView('view-checkout');
            this.updateCheckoutSummary();
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            alert('Este producto ya está en tu carrito');
        } else {
            this.items.push(product);
            this.save();
            this.render();
            // Optional: Show notification instead of switching view automatically
            showView('view-cart');
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.render();
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.updateTotal();
    }

    load() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.items = JSON.parse(stored);
            this.updateTotal();
        }
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.textContent = this.items.length;
            badge.style.display = this.items.length > 0 ? 'flex' : 'none';
        }
    }

    render() {
        const container = document.getElementById('cart-items-container-view');
        const totalEl = document.getElementById('cart-total-price-view');

        if (totalEl) {
            totalEl.textContent = `${this.total.toFixed(2)} €`;
        }

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 0;">
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 2rem;">Tu carrito está vacío</p>
                    <button class="btn-primary btn-back-home">Explorar Catálogo</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.9rem;">
                        <th style="text-align: left; padding: 1rem 0;">Producto</th>
                        <th style="text-align: right; padding: 1rem 0;">Precio</th>
                        <th style="text-align: right; padding: 1rem 0;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.items.map(item => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 1.5rem 0;">
                                <div style="display: flex; gap: 1rem; align-items: center;">
                                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: contain; background: #0f1219; border-radius: 4px;">
                                    <div>
                                        <h4 style="margin:0;">${item.name}</h4>
                                        <span style="font-size: 0.8rem; color: var(--text-muted);">Ref: ${item.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </td>
                            <td style="text-align: right; font-weight: 700;">${item.price.toFixed(2)} €</td>
                            <td style="text-align: right;">
                                <button class="btn-remove" data-id="${item.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">&times;</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Re-attach delete listeners
        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.removeItem(id);
            });
        });

        // Re-attach home buttons if any injected
        container.querySelectorAll('.btn-back-home').forEach(btn => {
            btn.addEventListener('click', () => showView('view-home'));
        });

        // Checkout Button
        const checkoutBtn = document.getElementById('btn-to-checkout');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                document.dispatchEvent(new Event('checkout-start'));
            };
        }
    }

    updateCheckoutSummary() {
        const list = document.getElementById('order-items-summary');
        const count = document.getElementById('order-count');
        const total = document.getElementById('order-total');

        if (list) {
            list.innerHTML = this.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span>${item.name}</span>
                    <span style="font-weight: 700;">${item.price.toFixed(2)} €</span>
                </div>
            `).join('');
        }

        if (count) count.textContent = this.items.length;
        if (total) total.textContent = `${this.total.toFixed(2)} €`;
    }
}
