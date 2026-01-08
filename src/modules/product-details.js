import { showView } from './navigation.js';

export class ProductDetails {
    constructor() {
        this.container = null;
    }

    init() {
        this.container = document.getElementById('product-details-content-view');
        this.attachEvents();
        console.log('Product Details Module Initialized');
    }

    attachEvents() {
        // Listen for view-product events
        document.addEventListener('view-product', (e) => {
            this.open(e.detail);
        });

        // Listen for load-product-by-id events (from URL routing)
        document.addEventListener('load-product-by-id', (e) => {
            this.loadById(e.detail);
        });
    }

    async loadById(id) {
        try {
            const response = await fetch('src/data/products.json');
            const products = await response.json();
            const product = products.find(p => p.id.toLowerCase() === id.toLowerCase());

            if (product) {
                this.render(product);
                // We use showView, which will update the URL
                showView('view-product-details', `pieza/${id.toLowerCase()}`, product);
            } else {
                console.error('Product not found:', id);
                showView('view-home', '/');
            }
        } catch (error) {
            console.error('Error loading product by ID:', error);
        }
    }

    open(product) {
        if (!this.container) return;

        this.render(product);
        // Update URL to pieza/id
        showView('view-product-details', `pieza/${product.id.toLowerCase()}`, product);
    }

    render(product) {
        this.container.innerHTML = `
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

        // Re-attach add to cart listener
        const addBtn = this.container.querySelector('.btn-add-modal');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
            });
        }
    }
}
