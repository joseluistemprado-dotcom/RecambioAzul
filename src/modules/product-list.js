
export class ProductList {
    constructor(containerId, ratingSystem = null) {
        this.container = document.getElementById(containerId);
        this.products = [];
        this.currentVehicle = null;
        this.currentCategory = null;
        this.currentSearch = "";
        this.ratingSystem = ratingSystem;
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/RecambioAzul/')) {
            return '/RecambioAzul/';
        }
        return '/';
    }

    async init() {
        this.attachEvents();
        try {
            const basePath = this.getBasePath();
            const response = await fetch(`${basePath}src/data/products.json?v=${Date.now()}`);
            this.products = await response.json();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    attachEvents() {
        // Listen for vehicle selection (manual selector)
        document.addEventListener('vehicle-selected', (e) => {
            this.currentVehicle = e.detail;
            this.applyFilters();
        });

        // Listen for vehicle identification (plate/VIN search)
        document.addEventListener('vehicle-identified', (e) => {
            console.log('Vehicle identified via search:', e.detail);
            this.currentVehicle = e.detail;
            this.applyFilters();
        });

        // Listen for category selection
        document.addEventListener('category-selected', (e) => {
            this.currentCategory = e.detail;
            this.applyFilters();
        });

        // Listen for Search
        document.addEventListener('search-query', (e) => {
            this.currentSearch = e.detail.toLowerCase();
            this.applyFilters();
        });
    }

    applyFilters() {
        let filtered = this.products;
        let title = 'Productos Destacados';

        // Filter by Vehicle
        if (this.currentVehicle) {
            const { brand, model } = this.currentVehicle;
            filtered = filtered.filter(p =>
                p.vehicle.includes(model.id) || p.vehicle.includes(brand.id) || p.vehicle === 'universal'
            );
            title = `Repuestos para ${brand.name} ${model.name}`;
        }

        // Filter by Category
        if (this.currentCategory) {
            filtered = filtered.filter(p => p.category === this.currentCategory);
            // If we have a vehicle selected, we append to the title, otherwise replace
            if (!this.currentVehicle) {
                const catName = this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
                title = `Categoría: ${catName}`;
            }
        }

        // Filter by Search Text
        if (this.currentSearch) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.currentSearch) ||
                p.category.toLowerCase().includes(this.currentSearch)
            );
        }

        this.render(filtered, title);
    }

    render(products, title = 'Productos Destacados') {
        if (!this.container) return;

        // Default limit (e.g., 3 rows * 4 cards = 12)
        const INITIAL_LIMIT = 12;
        const totalProducts = products.length;

        // Check if we are already showing all? 
        // We need state for "showingAll" or keep passing it. 
        // Simplest: Render initial chunk and add button if needed. 
        // If we want stateful "Load More", we need to store the current filtered list.
        this.currentFilteredProducts = products;

        // If we haven't rendered this list before, reset limit
        if (!this.currentLimit || this.currentListTitle !== title) {
            this.currentLimit = INITIAL_LIMIT;
            this.currentListTitle = title;
        }

        const visibleProducts = products.slice(0, this.currentLimit);

        const gridHtml = visibleProducts.map(p => `
            <div class="product-card">
                <div class="product-image-frame">
                    <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="product-image-placeholder" style="display:none">
                        <span>${p.category}</span>
                    </div>
                </div>
                <div class="product-info">
                    <h4>${p.name}</h4>
                    <p class="product-price">${p.price} €</p>
                    ${this.ratingSystem ? this.ratingSystem.renderCompactRating(p.id) : ''}
                    <p class="product-condition">${p.condition}</p>
                    ${this.ratingSystem && p.donorId ? this.ratingSystem.renderScrapyardBadge(p.donorId) : ''}
                    <button class="btn-primary btn-sm btn-add" data-id="${p.id}">Añadir</button>
                </div>
            </div>
        `).join('');

        let footerHtml = '';
        if (totalProducts > this.currentLimit) {
            footerHtml = `
                <div style="text-align: center; margin-top: 2rem; width: 100%;">
                    <button id="btn-show-more" class="btn-secondary">Mostrar Más (${totalProducts - this.currentLimit} restantes)</button>
                </div>
            `;
        }

        this.container.innerHTML = `
            <h2 class="section-title">${title}</h2>
            <div class="product-grid">
                ${gridHtml.length ? gridHtml : '<p>No se encontraron productos con estos criterios.</p>'}
            </div>
            ${footerHtml}
        `;

        // Attach event listeners
        this.container.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering details
                const productId = e.target.dataset.id;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
                }
            });
        });

        // Click on card to view details
        this.container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-add')) return;

                // Find ID from the button inside this card to be safe
                const productId = card.querySelector('.btn-add').dataset.id;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    document.dispatchEvent(new CustomEvent('view-product', { detail: product }));
                }
            });
            card.style.cursor = 'pointer'; // UI hint
        });

        // Show More Button logic
        const showMoreBtn = this.container.querySelector('#btn-show-more');
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                this.currentLimit += 12; // Show 12 more
                this.render(this.currentFilteredProducts, this.currentListTitle);
            });
        }
    }
}
