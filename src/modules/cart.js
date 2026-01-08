export class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.storageKey = 'recambio_azul_cart';
        this.isOpen = false;

        // Bind methods
        this.toggle = this.toggle.bind(this);
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

        // Cart toggle button (in header)
        const cartBtn = document.getElementById('cart-toggle-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', this.toggle);
        }

        // Close button (sidebar)
        const closeBtn = document.getElementById('cart-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.toggle);
        }

        // Overlay click to close
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (this.isOpen) this.toggle();
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            // If we want quantity logic, we'd do it here. 
            // For now, let's just say quantity is always 1 for unique replacement parts
            // or perhaps increment if it's a generic item.
            // Assuming unique parts for now:
            alert('Este producto ya está en tu carrito');
        } else {
            this.items.push(product);
            this.save();
            this.render();
            this.open(); // Open cart when adding item (UX preference)
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

    toggle() {
        this.isOpen = !this.isOpen;
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');

        if (sidebar && overlay) {
            if (this.isOpen) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            } else {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    }

    open() {
        if (!this.isOpen) this.toggle();
    }

    render() {
        const container = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total-price');

        if (totalEl) {
            totalEl.textContent = `${this.total.toFixed(2)} €`;
        }

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price} €</p>
                </div>
                <button class="btn-remove" data-id="${item.id}" aria-label="Eliminar">&times;</button>
            </div>
        `).join('');

        // Re-attach delete listeners
        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.removeItem(id);
            });
        });

        // Attach Checkout Listener
        const checkoutBtn = document.querySelector('.cart-footer .btn-primary');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.toggle(); // Close sidebar
                document.dispatchEvent(new Event('checkout-start'));
            });
        }
    }
}
