import { showView } from './navigation.js';

export class ProductDetails {
    constructor(ratingSystem = null) {
        this.container = null;
        this.ratingSystem = ratingSystem;
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

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/RecambioAzul/')) {
            return '/RecambioAzul/';
        }
        return '/';
    }

    async loadById(id) {
        try {
            const basePath = this.getBasePath();
            const response = await fetch(`${basePath}src/data/products.json?v=${Date.now()}`);
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
        const ratingData = this.ratingSystem ? this.ratingSystem.getProductRating(product.id) : null;

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
                    
                    ${ratingData ? `
                        <div class="details-rating">
                            ${this.ratingSystem.renderStars(ratingData.averageRating, true)}
                            <span class="details-review-count">(${ratingData.totalReviews} valoraciones)</span>
                        </div>
                    ` : ''}
                    
                    <div class="details-meta">
                        <p><strong>Referencia:</strong> ${product.id.toUpperCase()}</p>
                        <p><strong>Condición:</strong> <span class="badge-condition">${product.condition}</span></p>
                        <p><strong>Compatibilidad:</strong> ${product.vehicle || 'Consultar'}</p>
                    </div>
                    
                    ${this.ratingSystem && product.donorId ? this.ratingSystem.renderScrapyardBadge(product.donorId) : ''}
 
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
            
            ${this.ratingSystem ? this.ratingSystem.renderReviewsSection(product.id) : ''}
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
