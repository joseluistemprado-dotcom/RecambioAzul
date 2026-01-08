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

        // Count available parts
        const parts = this.products.filter(p => p.donorId === this.currentDonor.id);

        content.innerHTML = `
            <div style="padding: 2rem 2rem 1rem 2rem; border-bottom: 1px solid var(--border-color);">
                <h2 style="margin:0;">${this.currentDonor.brand} ${this.currentDonor.model} <span style="color:var(--text-muted); font-weight:400;">${this.currentDonor.version}</span></h2>
                <div style="display:flex; gap: 1rem; margin-top:1.5rem;">
                    <button class="nav-btn ${this.activeTab === 'info' ? 'active' : ''}" style="width:auto;" onclick="document.dispatchEvent(new CustomEvent('switch-donor-tab', {detail:'info'}))">
                        Ficha Técnica
                    </button>
                    <button class="nav-btn ${this.activeTab === 'parts' ? 'active' : ''}" style="width:auto;" onclick="document.dispatchEvent(new CustomEvent('switch-donor-tab', {detail:'parts'}))">
                        Aprovechamiento (${parts.length})
                    </button>
                </div>
            </div>
            
            <div style="flex:1; padding: 2rem; overflow-y:auto;">
                ${this.activeTab === 'info' ? this.renderInfoTab() : this.renderPartsTab(parts)}
            </div>
        `;

        // Listen for tab switch (using document event for delegated simplicity)
        // Note: In strict architecture we would bind this properly, but for speed we use a global listener in init or here.
        // Let's attach listener to the buttons directly here to avoid global pollution.
        content.querySelectorAll('.nav-btn').forEach(btn => {
            btn.onclick = (e) => {
                // Determine tab from text or index, simplistic:
                const text = btn.textContent;
                this.activeTab = text.includes('Ficha') ? 'info' : 'parts';
                this.renderModalContent();
            }
        });
    }

    renderInfoTab() {
        const d = this.currentDonor;
        return `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <img src="${d.image}" style="width:100%; border-radius:8px; border:1px solid var(--border-color);">
                </div>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <h3 style="color:var(--primary-blue);">Datos del Vehículo</h3>
                    <div class="details-meta">
                        <p><strong>VIN/Ref:</strong> ${d.id}</p>
                        <p><strong>Color:</strong> ${d.color}</p>
                        <p><strong>Kilometraje:</strong> ${d.km.toLocaleString()} km</p>
                        <p><strong>Año:</strong> ${d.year}</p>
                        <p><strong>Motivo Baja:</strong> ${d.damage}</p>
                        <p><strong>Fecha Entrada:</strong> ${d.date_dismantled}</p>
                    </div>
                    <div style="background: rgba(255,165,2,0.1); padding:1rem; border-radius:4px; border:1px solid #ffa502;">
                        <p style="color: #ffa502; margin:0; font-size:0.9rem;">⚠️ Este vehículo ha sido descontaminado y sus piezas verificadas según normativa CAT.</p>
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
