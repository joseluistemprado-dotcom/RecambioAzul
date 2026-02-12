import { showView } from './navigation.js';

export class ProductComparator {
    constructor() {
        this.selectedProducts = []; // Array of product objects
        this.maxItems = 4;
        this.barContainer = null;
        this.viewContainer = document.getElementById('view-compare');
    }

    init() {
        this.renderFloatingBar();
        this.attachGlobalEvents();
        console.log('ProductComparator Initialized');
    }

    attachGlobalEvents() {
        // Listen for toggle events from ProductList
        document.addEventListener('toggle-compare', (e) => {
            this.toggleProduct(e.detail);
        });
    }

    toggleProduct(product) {
        const index = this.selectedProducts.findIndex(p => p.id === product.id);

        if (index !== -1) {
            // Remove
            this.selectedProducts.splice(index, 1);
        } else {
            // Add
            if (this.selectedProducts.length >= this.maxItems) {
                alert(`Puedes comparar un máximo de ${this.maxItems} productos.`);
                return;
            }
            this.selectedProducts.push(product);
        }

        this.updateBar();
        // Emit event so ProductList can update checkbox state if needed
        document.dispatchEvent(new CustomEvent('compare-updated', {
            detail: {
                selectedIds: this.selectedProducts.map(p => p.id),
                count: this.selectedProducts.length
            }
        }));
    }

    renderFloatingBar() {
        // Create bar if not exists
        if (!this.barContainer) {
            this.barContainer = document.createElement('div');
            this.barContainer.id = 'compare-floating-bar';
            this.barContainer.className = 'compare-bar hidden';
            document.body.appendChild(this.barContainer);
        }
        this.updateBar();
    }

    updateBar() {
        if (!this.barContainer) return;

        const count = this.selectedProducts.length;

        if (count === 0) {
            this.barContainer.classList.add('hidden');
            return;
        }

        this.barContainer.classList.remove('hidden');
        this.barContainer.innerHTML = `
            <div class="compare-bar-content">
                <span class="compare-count">${count} productos seleccionados</span>
                <button id="btn-view-compare" class="btn-primary btn-sm">Comparar Ahora</button>
                <button id="btn-clear-compare" class="btn-text btn-sm" style="color:white; margin-left: 1rem;">Limpiar</button>
            </div>
        `;

        this.barContainer.querySelector('#btn-view-compare').addEventListener('click', () => {
            this.renderComparisonTable();
            showView('view-compare');
        });

        this.barContainer.querySelector('#btn-clear-compare').addEventListener('click', () => {
            this.selectedProducts = [];
            this.updateBar();
            document.dispatchEvent(new CustomEvent('compare-updated', {
                detail: { selectedIds: [], count: 0 }
            }));
        });
    }

    renderComparisonTable() {
        if (!this.viewContainer) return;

        if (this.selectedProducts.length === 0) {
            this.viewContainer.innerHTML = `
                <div class="container" style="padding: 4rem 0; text-align: center;">
                    <h2>No hay productos para comparar</h2>
                    <button class="btn-primary" onclick="window.history.back()">Volver</button>
                </div>
            `;
            return;
        }

        const products = this.selectedProducts;

        this.viewContainer.innerHTML = `
            <div class="container" style="padding: 2rem 0;">
                <div class="section-header" style="margin-bottom: 2rem;">
                    <button class="btn-secondary" onclick="window.history.back()">← Volver</button>
                    <h2>Comparador de Productos</h2>
                </div>
                
                <div class="comparison-table-wrapper">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Característica</th>
                                ${products.map(p => `
                                    <th>
                                        <div class="th-product">
                                            <img src="${p.image}" alt="${p.name}">
                                            <span>${p.name.substring(0, 30)}...</span>
                                        </div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="feature-label">Precio</td>
                                ${products.map(p => `<td class="price-cell">${p.price} €</td>`).join('')}
                            </tr>
                            <tr>
                                <td class="feature-label">Estado</td>
                                ${products.map(p => `<td>${p.condition}</td>`).join('')}
                            </tr>
                            <tr>
                                <td class="feature-label">Vehículo Compatible</td>
                                ${products.map(p => `<td>${p.vehicle}</td>`).join('')}
                            </tr>
                            <tr>
                                <td class="feature-label">Categoría</td>
                                ${products.map(p => `<td>${p.category}</td>`).join('')}
                            </tr>
                             <tr>
                                <td class="feature-label">ID Donante</td>
                                ${products.map(p => `<td>${p.donorId || 'N/A'}</td>`).join('')}
                            </tr>
                             <tr>
                                <td class="feature-label">Acción</td>
                                ${products.map(p => `
                                    <td>
                                        <button class="btn-primary btn-sm btn-add-compare" data-id="${p.id}">Añadir al Carrito</button>
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Attach Add to Cart events
        this.viewContainer.querySelectorAll('.btn-add-compare').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const product = products.find(p => p.id === id);
                if (product) {
                    document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
                    alert('Producto añadido al carrito');
                }
            });
        });
    }
}
