
export class VehicleSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = [];
        this.selectedBrand = null;
        this.selectedModel = null;
    }

    async init() {
        try {
            const response = await fetch('src/data/vehicles.json');
            this.data = await response.json();
            this.renderBrands();
        } catch (error) {
            console.error('Error loading vehicle data:', error);
            this.container.innerHTML = '<p class="error">Error cargando vehículos</p>';
        }
    }

    renderBrands() {
        if (!this.container) return;

        const html = `
            <div class="vehicle-selector card">
                <h3>Selecciona tu Vehículo</h3>
                <div class="selector-controls">
                    <select id="brand-select" class="form-select">
                        <option value="">Marca</option>
                        ${this.data.map(brand => `<option value="${brand.id}">${brand.name}</option>`).join('')}
                    </select>
                    
                    <select id="model-select" class="form-select" disabled>
                        <option value="">Modelo</option>
                    </select>

                    <button id="search-parts-btn" class="btn-primary" disabled>Buscar Piezas</button>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        const brandSelect = document.getElementById('brand-select');
        const modelSelect = document.getElementById('model-select');
        const searchBtn = document.getElementById('search-parts-btn');

        brandSelect.addEventListener('change', (e) => {
            this.selectedBrand = this.data.find(b => b.id === e.target.value);
            this.selectedModel = null;
            this.updateModelSelect(modelSelect);
            searchBtn.disabled = true;
        });

        modelSelect.addEventListener('change', (e) => {
            if (this.selectedBrand) {
                this.selectedModel = this.selectedBrand.models.find(m => m.id === e.target.value);
                searchBtn.disabled = !this.selectedModel;
            }
        });

        searchBtn.addEventListener('click', () => {
            // Dispatch custom event for other components
            const event = new CustomEvent('vehicle-selected', {
                detail: { brand: this.selectedBrand, model: this.selectedModel }
            });
            document.dispatchEvent(event);
        });
    }

    updateModelSelect(selectElement) {
        selectElement.innerHTML = '<option value="">Modelo</option>';
        selectElement.disabled = !this.selectedBrand;

        if (this.selectedBrand) {
            this.selectedBrand.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                selectElement.appendChild(option);
            });
        }
    }
}
