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
        this.modal = document.getElementById('donor-details-modal');

        await this.loadData();
        this.attachGlobalEvents();
    }

    async loadData() {
        try {
            const [dResponse, pResponse] = await Promise.all([
                fetch('src/data/donor_vehicles.json'),
                fetch('src/data/products.json')
            ]);
            this.donors = await dResponse.json();
            this.products = await pResponse.json();
        } catch (error) {
            console.error('Error loading donor data', error);
        }
    }

    attachGlobalEvents() {
        // Nav Link
        const navLink = document.getElementById('nav-donor-vehicles');
        if (navLink) {
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection();
            });
        }

        // Back to Home
        const backBtn = document.getElementById('btn-back-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.hideSection());
        }

        // Modal Close
        const closeBtn = document.getElementById('donor-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    }

    showSection() {
        // Hide other main content (optional, but good for SPA feel)
        document.querySelector('main').classList.add('hidden');
        this.section.classList.remove('hidden');
        this.renderGrid();
    }

    hideSection() {
        this.section.classList.add('hidden');
        document.querySelector('main').classList.remove('hidden');
    }

    renderGrid() {
        this.grid.innerHTML = this.donors.map(donor => `
            <div class="donor-card card" data-id="${donor.id}" style="cursor:pointer; padding:0; overflow:hidden;">
                <div style="height: 200px; background: #0f1219; position:relative;">
                   <img src="${donor.image}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
                   <div style="position:absolute; bottom:0; left:0; width:100%; background:linear-gradient(transparent, rgba(0,0,0,0.9)); padding: 1rem;">
                        <h3 style="margin:0; font-size:1.2rem;">${donor.brand} ${donor.model}</h3>
                        <span style="color:var(--primary-blue); font-size:0.9rem;">${donor.version}</span>
                   </div>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="color:var(--text-muted);">Año:</span>
                        <span>${donor.year}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                        <span style="color:var(--text-muted);">Ref:</span>
                        <span>${donor.id}</span>
                    </div>
                    <button class="btn-primary" style="width:100%">Ver Despiece</button>
                </div>
            </div>
        `).join('');

        // Click events
        this.grid.querySelectorAll('.donor-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                this.openModal(id);
            });
        });
    }

    openModal(id) {
        this.currentDonor = this.donors.find(d => d.id === id);
        if (!this.currentDonor) return;

        this.activeTab = 'info';
        this.modal.classList.add('active');
        history.pushState({ modal: 'donor-details-modal' }, "");
        this.renderModalContent();
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

    renderModalContent() {
        const content = document.getElementById('donor-modal-content');
        if (!content) return;

        // Count available parts
        const parts = this.products.filter(p => p.donorId === this.currentDonor.id);

        content.innerHTML = `
            <div class="donor-details-wrapper">
                <div class="donor-modal-hero">
                    <img src="${this.currentDonor.image}" alt="${this.currentDonor.brand}">
                </div>
                
                <div class="donor-modal-header">
                    <h2 class="donor-title-main">${this.currentDonor.brand} ${this.currentDonor.model}</h2>
                    <p class="donor-version-sub">${this.currentDonor.version}</p>
                    
                    <div class="donor-tabs-simple mobile-hidden">
                        <button class="tab-btn ${this.activeTab === 'info' ? 'active' : ''}">Ficha Técnica</button>
                        <button class="tab-btn ${this.activeTab === 'parts' ? 'active' : ''}">Piezas (${parts.length})</button>
                    </div>
                </div>

                <div class="donor-modal-scroll-area">
                    <div class="mobile-only-stack">
                        ${this.renderInfoTab()}
                        <div style="margin-top: 2rem;">
                            <h3 class="sheet-title" style="margin-bottom: 1rem;">Piezas Disponibles (${parts.length})</h3>
                            ${this.renderPartsTab(parts)}
                        </div>
                    </div>
                    <div class="desktop-only-tabs">
                        ${this.activeTab === 'info' ? this.renderInfoTab() : this.renderPartsTab(parts)}
                    </div>
                </div>
            </div>
        `;

        // Listen for tab switch
        content.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = (e) => {
                this.activeTab = btn.textContent.includes('Ficha') ? 'info' : 'parts';
                this.renderModalContent();
            }
        });
    }

    renderInfoTab() {
        const d = this.currentDonor;
        return `
            <div class="donor-info-layout">
                <div class="donor-info-image desktop-only">
                    <img src="${d.image}" alt="${d.brand}" style="width:100%; border-radius:8px; border:1px solid var(--border-color);">
                </div>
                <div class="donor-technical-sheet">
                    <h3 class="sheet-title">Datos del Vehículo</h3>
                    <div class="sheet-grid">
                        <div class="sheet-row"><span>Referencia:</span> <strong>${d.id}</strong></div>
                        <div class="sheet-row"><span>Color:</span> <strong>${d.color}</strong></div>
                        <div class="sheet-row"><span>Kilometraje:</span> <strong>${d.km.toLocaleString()} km</strong></div>
                        <div class="sheet-row"><span>Año:</span> <strong>${d.year}</strong></div>
                        <div class="sheet-row"><span>Daños:</span> <strong>${d.damage}</strong></div>
                        <div class="sheet-row"><span>Despiece:</span> <strong>${d.date_dismantled}</strong></div>
                    </div>
                    
                    <div class="cat-notice">
                        <p>⚠️ Vehículo descontaminado y verificado según normativa CAT (Centro Autorizado de Tratamiento).</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderPartsTab(parts) {
        if (parts.length === 0) return '<p>No hay piezas disponibles para este vehículo actualmente.</p>';

        return `
            <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                ${parts.map(p => `
                    <div class="card" style="padding:1rem; display:flex; flex-direction:column; gap:0.5rem;">
                        <img src="${p.image}" style="width:100%; height:120px; object-fit:contain; background:#0f1219; border-radius:4px;">
                        <h4 style="font-size:0.9rem; margin:0;">${p.name}</h4>
                        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:var(--primary-blue); font-weight:bold;">${p.price} €</span>
                            <button class="btn-primary btn-sm" onclick="document.dispatchEvent(new CustomEvent('view-product', {detail: ${JSON.stringify(p).replace(/"/g, '&quot;')}}))">Ver</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
