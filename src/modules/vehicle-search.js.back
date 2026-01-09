export class VehicleSearch {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.donors = [];
        this.vehicleMap = {};
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/RecambioAzul/')) {
            return '/RecambioAzul/';
        }
        return '/';
    }

    async init() {
        await this.loadDonors();
        this.buildVehicleMap();
        this.render();
        this.attachEvents();
        console.log('Vehicle Search Module Initialized');
    }

    async loadDonors() {
        try {
            const basePath = this.getBasePath();
            const cacheBuster = `?v=${Date.now()}`;
            const response = await fetch(basePath + 'src/data/donor_vehicles.json' + cacheBuster);
            this.donors = await response.json();
            console.log('Loaded donors for search:', this.donors.length);
        } catch (error) {
            console.error('Error loading donor vehicles for search:', error);
        }
    }

    buildVehicleMap() {
        // Create a mapping from brand+model to vehicle ID format used in products.json
        this.vehicleMap = {
            'Tesla Model 3': 'tesla-model3',
            'Tesla Model Y': 'tesla-modely',
            'Renault Zoe': 'renault-zoe',
            'Nissan Leaf': 'nissan-leaf',
            'Volkswagen ID.4': 'vw-id4',
            'Hyundai IONIQ 5': 'hyundai-ioniq5',
            'Kia EV6': 'kia-ev6',
            'Audi e-tron Sportback': 'audi-etron',
            'BMW i3': 'bmw-i3',
            'Peugeot e-208': 'peugeot-e208'
        };
    }

    async searchByPlateOrVIN(query) {
        const normalizedQuery = query.trim().toUpperCase().replace(/\s+/g, '');
        console.log('Searching for:', normalizedQuery);

        // Search in local donors by plate or VIN
        const found = this.donors.find(v => {
            const plate = (v.plate || '').replace(/\s+/g, '').toUpperCase();
            const vin = (v.vin || '').toUpperCase();
            return plate === normalizedQuery || vin === normalizedQuery;
        });

        if (found) {
            console.log('Vehicle found in local database:', found);
            const vehicleKey = `${found.brand} ${found.model}`;
            const vehicleId = this.vehicleMap[vehicleKey];

            if (vehicleId) {
                // Emit event with vehicle data
                document.dispatchEvent(new CustomEvent('vehicle-identified', {
                    detail: {
                        brand: { id: vehicleId.split('-')[0], name: found.brand },
                        model: { id: vehicleId, name: found.model },
                        version: found.version,
                        year: found.year,
                        donorId: found.id
                    }
                }));
                return { success: true, vehicle: found, source: 'local' };
            } else {
                console.warn('Vehicle found but no mapping exists for:', vehicleKey);
                return { success: false, message: 'Vehículo encontrado pero sin piezas disponibles' };
            }
        }

        // If not found locally and looks like a VIN (17 characters), try NHTSA
        if (normalizedQuery.length === 17) {
            console.log('Not found locally, trying NHTSA API...');
            return await this.searchNHTSA(normalizedQuery);
        }

        return { success: false, message: 'No se encontró vehículo con esa matrícula o bastidor' };
    }

    async searchNHTSA(vin) {
        try {
            const response = await fetch(
                `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
            );
            const data = await response.json();

            if (data.Results && data.Results.length > 0) {
                const vehicle = this.parseNHTSAData(data.Results, vin);

                // Check if we got meaningful data
                if (vehicle.brand && vehicle.model) {
                    console.log('Vehicle found via NHTSA:', vehicle);
                    return { success: true, vehicle: vehicle, source: 'nhtsa' };
                }
            }

            return { success: false, message: 'VIN no encontrado en base de datos NHTSA (EE.UU.)' };
        } catch (error) {
            console.error('Error fetching NHTSA data:', error);
            return { success: false, message: 'Error al consultar base de datos NHTSA' };
        }
    }

    parseNHTSAData(results, vin) {
        const getValue = (name) => {
            const item = results.find(r => r.Variable === name);
            return item?.Value || '';
        };

        // Log all available fields for debugging
        console.log('NHTSA Results:', results.map(r => `${r.Variable}: ${r.Value}`));

        // Extract engine displacement
        const displacement = getValue('DisplacementL') || getValue('DisplacementCC');
        const cylinders = getValue('EngineCylinders');

        // Build engine description
        let engineDesc = '';
        if (displacement && cylinders) {
            engineDesc = `${displacement} L / ${cylinders} cyl`;
        } else if (getValue('EngineModel')) {
            engineDesc = getValue('EngineModel');
        } else if (cylinders) {
            engineDesc = `${cylinders} cilindros`;
        } else {
            engineDesc = '---';
        }

        // Extract power (prefer kW, fallback to HP)
        const engineKW = getValue('EngineKW');
        const engineHP = getValue('EngineHP');
        let powerDesc = '---';
        if (engineKW && engineHP) {
            powerDesc = `${engineKW} kW (${engineHP} HP)`;
        } else if (engineHP) {
            powerDesc = `${engineHP} HP`;
        } else if (engineKW) {
            powerDesc = `${engineKW} kW`;
        }

        // Extract fuel type
        const fuelType = getValue('FuelTypePrimary');
        const fuelTypeSpanish = {
            'Gasoline': 'Gasolina',
            'Diesel': 'Diésel',
            'Electric': 'Eléctrico',
            'Hybrid': 'Híbrido',
            'Plug-in Hybrid': 'Híbrido Enchufable',
            'Flex Fuel': 'Flex Fuel'
        };
        const fuelDisplay = fuelTypeSpanish[fuelType] || fuelType || 'Desconocido';

        return {
            id: 'NHTSA-' + vin.substring(0, 8),
            brand: getValue('Make'),
            model: getValue('Model'),
            version: getValue('Trim') || getValue('Series') || '---',
            year: parseInt(getValue('ModelYear')) || new Date().getFullYear(),
            plate: '---',
            vin: vin,
            engine: engineDesc,
            fuelType: fuelDisplay,
            power: powerDesc,
            battery: getValue('BatteryType') || (fuelDisplay === 'Eléctrico' ? 'Ver especificaciones' : '---'),
            range: '---',
            weight: getValue('GVWR') || '---',
            dimensions: '---',
            emissions: '---',
            transmission: getValue('TransmissionStyle') || getValue('TransmissionSpeeds') ? getValue('TransmissionSpeeds') + ' velocidades' : 'Automática',
            drivetrain: getValue('DriveType') || '---',
            image: 'src/assets/vehicles/default.png',
            damage: 'N/A',
            date_dismantled: 'N/A'
        };
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="vehicle-search-wrapper" style="margin-bottom: 2rem;">
                <div class="search-header" style="text-align: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-main);">Búsqueda Rápida</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">Introduce tu matrícula o número de bastidor</p>
                </div>
                
                <div class="search-input-group" style="max-width: 600px; margin: 0 auto;">
                    <div style="display: flex; gap: 1rem; align-items: stretch;">
                        <input 
                            type="text" 
                            id="vehicle-search-input" 
                            class="form-input" 
                            placeholder="Ej: 1234 LMN o 5YJ3E7EB2MF000001"
                            style="flex: 1; padding: 1rem; font-size: 1rem;"
                        >
                        <button 
                            id="vehicle-search-btn" 
                            class="btn-primary" 
                            style="padding: 1rem 2rem; white-space: nowrap;"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.5rem;">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            Buscar
                        </button>
                    </div>
                    <div id="search-result-message" style="margin-top: 1rem; text-align: center; min-height: 24px;"></div>
                </div>

                <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        <strong>O selecciona manualmente tu vehículo:</strong>
                    </p>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const input = document.getElementById('vehicle-search-input');
        const button = document.getElementById('vehicle-search-btn');
        const messageDiv = document.getElementById('search-result-message');

        if (!input || !button) return;

        const performSearch = async () => {
            const query = input.value.trim();
            if (!query) {
                this.showMessage(messageDiv, 'Por favor, introduce una matrícula o bastidor', 'warning');
                return;
            }

            // Show loading message
            this.showMessage(messageDiv, 'Buscando...', 'warning');

            const result = await this.searchByPlateOrVIN(query);

            if (result.success) {
                this.showVehicleDetails(result.vehicle, result.source);
                // Scroll to products
                setTimeout(() => {
                    const productSection = document.getElementById('product-list-container');
                    if (productSection) {
                        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);
            } else {
                this.showMessage(messageDiv, `✗ ${result.message}`, 'error');
            }
        };

        button.addEventListener('click', performSearch);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    showVehicleDetails(vehicle, source = 'local') {
        const messageDiv = document.getElementById('search-result-message');
        if (!messageDiv) return;

        const sourceLabel = source === 'nhtsa' ?
            '<span style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">NHTSA (EE.UU.)</span>' :
            '<span style="background: var(--primary-blue); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Base de Datos Local</span>';

        messageDiv.innerHTML = `
            <div style="background: var(--card-bg); border-radius: 12px; padding: 1.5rem; margin-top: 1rem; text-align: left; border: 2px solid var(--primary-blue); box-shadow: 0 4px 12px rgba(0, 240, 255, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="color: var(--primary-blue); margin: 0; font-size: 1.2rem;">${vehicle.brand} ${vehicle.model}</h4>
                            ${sourceLabel}
                        </div>
                        <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem;">${vehicle.version} • ${vehicle.year}</p>
                    </div>
                    <button id="close-vehicle-details" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5rem; padding: 0; line-height: 1;">&times;</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Matrícula</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.plate}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Bastidor (VIN)</span>
                        <strong style="color: var(--text-main); font-size: 0.9rem;">${vehicle.vin}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Potencia</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.power || '---'}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Batería</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.battery || '---'}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Autonomía</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.range || '---'}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Tracción</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.drivetrain || '---'}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Peso</span>
                        <strong style="color: var(--text-main); font-size: 1rem;">${vehicle.weight || '---'}</strong>
                    </div>
                    <div class="spec-item">
                        <span style="color: var(--text-muted); font-size: 0.85rem; display: block;">Dimensiones</span>
                        <strong style="color: var(--text-main); font-size: 0.85rem;">${vehicle.dimensions || '---'}</strong>
                    </div>
                </div>

                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); text-align: center;">
                    <p style="color: var(--primary-blue); font-weight: 600; margin: 0;">
                        ${source === 'nhtsa' ?
                '⚠️ Vehículo de base de datos NHTSA - Piezas compatibles limitadas' :
                '✓ Mostrando piezas compatibles con este vehículo'}
                    </p>
                </div>
            </div>
        `;

        // Add close button event
        const closeBtn = document.getElementById('close-vehicle-details');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                messageDiv.innerHTML = '';
            });
        }
    }

    showMessage(element, text, type) {
        if (!element) return;

        const colors = {
            success: 'var(--primary-blue)',
            error: '#ef4444',
            warning: '#f59e0b'
        };

        element.textContent = text;
        element.style.color = colors[type] || 'var(--text-main)';
        element.style.fontWeight = '600';
        element.style.fontSize = '0.95rem';
    }
}
