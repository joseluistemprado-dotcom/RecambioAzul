export class CategorySearch {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.categories = [
            { id: 'baterias', name: 'Baterías', icon: '🔋' }, // Battery
            { id: 'motores', name: 'Motores', icon: '⚙️' }, // Motor
            { id: 'iluminacion', name: 'Iluminación', icon: '💡' }, // Light
            { id: 'carroceria', name: 'Carrocería', icon: '🚗' }, // Body
            { id: 'carga', name: 'Carga', icon: '🔌' }, // Charge
            { id: 'climatizacion', name: 'Climatización', icon: '❄️' }, // Motor (reuse)
            { id: 'interior', name: 'Interior', icon: '💺' }, // Body (reuse)
            { id: 'ruedas', name: 'Ruedas', icon: '🛞' } // Motor (reuse)
        ];
        this.selectedCategory = null;
    }

    init() {
        if (this.container) {
            this.render();
            this.attachEvents();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="category-search text-center">
                <h3 style="margin-bottom: 1rem; color: var(--primary-blue);">Buscar por Familia</h3>
                <div class="category-list">
                    <button class="btn-category active" data-id="all">
                        <span class="cat-icon">🔍</span>
                        <span class="cat-name">Todo</span>
                    </button>
                    ${this.categories.map(cat => `
                        <button class="btn-category" data-id="${cat.id}">
                            <span class="cat-icon">${cat.icon}</span>
                            <span class="cat-name">${cat.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEvents() {
        this.container.querySelectorAll('.btn-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const categoryId = btn.dataset.id;

                // Update UI
                this.container.querySelectorAll('.btn-category').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Dispatch event
                this.selectedCategory = categoryId === 'all' ? null : categoryId;
                document.dispatchEvent(new CustomEvent('category-selected', { detail: this.selectedCategory }));
            });
        });
    }
}
