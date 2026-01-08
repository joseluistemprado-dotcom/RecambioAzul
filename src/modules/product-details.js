export class ProductDetails {
    constructor() {
        this.modal = null;
        this.content = null;
        this.isOpen = false;
    }

    init() {
        this.modal = document.getElementById('product-details-modal');
        this.content = document.getElementById('product-details-content');

        this.attachEvents();
        console.log('Product Details Module Initialized');
    }

    attachEvents() {
        // Listen for view-product events
        document.addEventListener('view-product', (e) => {
            this.open(e.detail);
        });

        // Close button
        const closeBtn = document.getElementById('product-details-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Click outside to close
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    open(product) {
        if (!this.modal || !this.content) return;

        this.render(product);
        this.modal.classList.add('active');
        history.pushState({ modal: 'product-details-modal' }, "");
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    render(product) {
        this.content.innerHTML = `
            <div class="details-grid">
                <div class="details-image">
                    <div class="product-image-frame" style="height: 100%; border: none;">
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                        <div class="product-image-placeholder large" style="display:none">
                            <span>${product.category}</span>
                        </div>
                    </div>
                </div>
                <div class="details-info">
                    <h2 class="details-title">${product.name}</h2>
                    <p class="details-price">${product.price} €</p>
                    
                    <div class="details-meta">
                        <p><strong>Referencia:</strong> ${product.id.toUpperCase()}</p>
                        <p><strong>Condición:</strong> <span class="badge-condition">${product.condition}</span></p>
                        <p><strong>Compatibilidad:</strong> ${product.vehicle || 'Consultar'}</p>
                    </div>

                    <div class="details-description">
                        <h3>Descripción</h3>
                        <p>Pieza verificada y probada. Garantía de funcionamiento. Envíos en 24/48h a toda la península.</p>
                    </div>

                    <div class="details-actions">
                        <button class="btn-primary btn-lg btn-add-modal" data-id="${product.id}">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Re-attach add to cart listener for the modal button
        const addBtn = this.content.querySelector('.btn-add-modal');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
                this.close();
            });
        }
    }
}
