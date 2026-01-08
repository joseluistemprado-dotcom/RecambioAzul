export class DonorVehicles {
    constructor() {
        this.donors = [];
        this.products = [];
        this.section = null;
        this.grid = null;
        this.modal = null;
        this.currentDonor = null;
        this.activeTab = 'info'; // info | parts
    }

    async init() {
        this.section = document.getElementById('donor-vehicles-section');
        this.grid = document.getElementById('donor-list-grid');
        this.detailsContainer = document.getElementById('donor-details-content');

        await this.loadData();

        this.attachEvents();
        this.renderList();
        console.log('Donor Vehicles Module Initialized');
    }

    async loadData() {
        try {
            const [vResp, pResp] = await Promise.all([
                fetch('src/data/donor_vehicles.json'),
                fetch('src/data/products.json')
            ]);
            this.donors = await vResp.json();
            this.products = await pResp.json();
        } catch (error) {
            console.error('Error loading data for DonorVehicles:', error);
        }
    }

    attachEvents() {
        // Initial navigation handled by navigation.js setupView

        // Listen for load-vehicle-by-id events (from URL routing)
        document.addEventListener('load-vehicle-by-id', (e) => {
            this.loadById(e.detail);
        });
    }

    async loadById(id) {
        // Wait for data if not loaded yet
        if (!this.donors || this.donors.length === 0) {
            await this.loadData();
        }

        const vehicle = this.donors.find(v => v.id.toLowerCase() === id.toLowerCase());

        if (vehicle) {
            this.renderDetailsView(vehicle);
            showView('view-donor-details', `vehiculo/${id.toLowerCase()}`, vehicle);
        } else {
            console.error('Vehicle not found:', id);
            showView('view-home', '/');
        }
    }

    async renderList() {
        if (!this.grid) return;

        this.grid.innerHTML = this.donors.map(v => `
            <div class="product-card donor-card" data-id="${v.id}">
                <div class="product-image-frame">
                    <img src="${v.image}" alt="${v.brand} ${v.model}" class="product-image">
                </div>
                <div class="product-info">
                    <span class="product-category">${v.brand}</span>
                    <h4>${v.model} (${v.year})</h4>
                    <p class="product-price" style="font-size: 0.9rem; color: var(--text-muted);">Nº Ref: ${v.id}</p>
                    <button class="btn-primary" style="width: 100%; margin-top: 1rem;">Ver Detalles</button>
                </div>
            </div>
        `).join('');

        // Click events
        this.grid.querySelectorAll('.donor-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const vehicle = this.donors.find(v => v.id === id);
                if (vehicle) this.openDetails(vehicle);
            });
        });
    }

    openDetails(vehicle) {
        if (!this.detailsContainer) return;

        this.renderDetailsView(vehicle);
        showView('view-donor-details', `vehiculo/${vehicle.id.toLowerCase()}`, vehicle);
    }

    renderDetailsView(vehicle) {
        this.detailsContainer.innerHTML = `
            <div class="donor-details-wrapper">
                <div class="donor-modal-header">
                    <div class="donor-title-group">
                        <h2 class="donor-title-main">${vehicle.brand} ${vehicle.model}</h2>
                        <span class="donor-version-sub">${vehicle.version} · ${vehicle.year}</span>
                    </div>
                </div>

                <div class="donor-tabs-simple">
                    <button class="tab-btn active" data-tab="info">Ficha Técnica</button>
                    <button class="tab-btn" data-tab="parts">Aprovechamiento</button>
                </div>

                <div class="donor-modal-scroll-area">
                    <div id="donor-tab-content">
                        ${this.renderInfoTab(vehicle)}
                    </div>
                </div>
            </div>
        `;

        this.attachTabEvents(vehicle);
    }

    attachTabEvents(vehicle) {
        const tabs = this.detailsContainer.querySelectorAll('.tab-btn');
        const content = this.detailsContainer.querySelector('#donor-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                if (tab.dataset.tab === 'info') {
                    content.innerHTML = this.renderInfoTab(vehicle);
                } else {
                    content.innerHTML = this.renderPartsTab(vehicle);
                }
            });
        });
    }

    renderInfoTab(vehicle) {
        return `
            <div class="donor-info-layout">
                <div class="donor-info-image">
                    <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.model}" class="donor-sheet-img">
                </div>
                <div class="donor-info-specs">
                    <h3 class="sheet-title">Información del Vehículo</h3>
                    <div class="sheet-grid">
                        <div class="sheet-row"><span>Marca:</span><strong>${vehicle.brand}</strong></div>
                        <div class="sheet-row"><span>Modelo:</span><strong>${vehicle.model}</strong></div>
                        <div class="sheet-row"><span>Versión:</span><strong>${vehicle.version}</strong></div>
                        <div class="sheet-row"><span>Año:</span><strong>${vehicle.year}</strong></div>
                        <div class="sheet-row"><span>Motor:</span><strong>${vehicle.engine || 'N/D'}</strong></div>
                        <div class="sheet-row"><span>Combustible:</span><strong>${vehicle.fuelType || 'Eléctrico'}</strong></div>
                    </div>
                    <div class="cat-notice">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        <span>Vehículo verificado - Centro Autorizado CAT</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderPartsTab(vehicle) {
        // Filter products that belong to this donor vehicle
        const vehicleParts = this.products.filter(p => p.donorId === vehicle.id);

        if (vehicleParts.length === 0) {
            return `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">No hay piezas registradas para este vehículo en este momento.</p>`;
        }

        return `
            <div class="donor-parts-list" style="padding: 1rem 0;">
                <h3 class="sheet-title">Piezas disponibles de este vehículo</h3>
                <div class="parts-scroll-container" style="max-height: 500px; overflow-y: auto; padding-right: 10px;">
                    <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                        ${vehicleParts.map(p => `
                            <div class="product-card mini" style="cursor: pointer;" onclick="document.dispatchEvent(new CustomEvent('view-product', { detail: ${JSON.stringify(p).replace(/"/g, '&quot;')} }))">
                                <div class="product-image-frame" style="height: 120px;">
                                    <img src="${p.image}" alt="${p.name}" class="product-image" style="object-fit: contain;">
                                </div>
                                <div class="product-info" style="padding: 1rem;">
                                    <h4 style="font-size: 0.9rem; margin:0; height: 2.4rem; overflow: hidden;">${p.name}</h4>
                                    <p class="product-price" style="font-size: 1rem; color: var(--primary-blue); margin: 5px 0;">${p.price} €</p>
                                    <button class="btn-primary btn-sm" style="width: 100%;" onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('add-to-cart', { detail: ${JSON.stringify(p).replace(/"/g, '&quot;')} }))">Añadir</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}
