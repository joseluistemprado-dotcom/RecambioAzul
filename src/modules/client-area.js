export class ClientArea {
    constructor() {
        this.modal = null;
        this.isLoggedIn = false;
        this.currentTab = 'active'; // active, history, profile

        // Mock Data
        this.userProfile = {
            name: "Juan Pérez",
            email: "juan.perez@email.com",
            phone: "+34 600 123 456",
            address: "Calle de la Tecnología 42"
        };

        this.mockActiveOrders = [
            { id: 'ORD-2026-003', date: '08/01/2026', status: 'En Reparto', items: 'Batería Tesla Model 3', total: '450.00 €' },
            { id: 'ORD-2026-002', date: '05/01/2026', status: 'Preparando', items: 'Faro LED Matrix', total: '850.00 €' }
        ];

        this.mockOrderHistory = [
            { id: 'ORD-2025-089', date: '15/12/2025', status: 'Entregado', items: 'Cable de Carga Tipo 2', total: '120.00 €' },
            { id: 'ORD-2025-045', date: '02/11/2025', status: 'Entregado', items: 'Alfombrillas Goma ID.4', total: '60.00 €' },
            { id: 'ORD-2025-012', date: '10/10/2025', status: 'Devuelto', items: 'Sensor TPMS', total: '40.00 €' }
        ];
    }

    init() {
        this.modal = document.getElementById('client-area-modal');
        this.attachEvents();
    }

    attachEvents() {
        // Global Open Buttons
        document.querySelectorAll('.btn-client-area').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close Button
        const closeBtn = document.getElementById('client-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay Click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
            history.pushState({ modal: 'client-area-modal' }, "");
            this.render();
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const emailInput = document.getElementById('login-email');
        if (emailInput && emailInput.value) {
            this.userProfile.email = emailInput.value; // Capture email
            this.isLoggedIn = true;
            this.render();
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.currentTab = 'active'; // Reset tab
        this.render();
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.render();
    }

    render() {
        const container = this.modal.querySelector('.modal-container');

        // Reset container classes if needed or toggle 'large' class
        if (this.isLoggedIn) {
            container.classList.add('large');
            container.style.maxWidth = '900px';
        } else {
            container.classList.remove('large');
            container.style.maxWidth = '500px';
        }

        // Close button must be re-inserted or preserved. 
        // We'll rewrite the inner HTML of a content div, preserving the close button if it's separate, 
        // but current HTML structure has close button inside .modal-container.
        // We will stick to full re-render of inner content except the close button if possible, but simplest is full innerHTML.

        // BETTER APPROACH: Just rewrite everything inside .modal-container?
        // Let's grab the content area specifically. 
        // Looking at index.html, we have <div style="padding: 2rem;"> directly inside container.
        // We should replace the entire innerHTML of modal-container to control structure.

        container.innerHTML = `
            <button id="client-close-dynamic" class="modal-close" style="z-index:20;">&times;</button>
            ${this.isLoggedIn ? this.renderDashboard() : this.renderLogin()}
        `;

        // Re-attach internal events
        this.attachInternalEvents(container);
    }

    renderLogin() {
        return `
            <div style="padding: 3rem 2rem;">
                <h2 class="section-title" style="margin-top:0; text-align: center;">Acceso Cliente</h2>
                <form id="login-form-dynamic" style="max-width: 320px; margin: 0 auto;">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" class="form-input" required placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" class="form-input" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Entrar</button>
                </form>
                <p style="margin-top: 2rem; color: var(--text-muted); text-align: center; font-size: 0.9rem;">
                    <a href="#" style="color: var(--primary-blue);">Crear cuenta</a> | 
                    <a href="#" style="color: var(--text-muted);">¿Olvidaste tu contraseña?</a>
                </p>
            </div>
        `;
    }

    renderDashboard() {
        return `
            <div class="client-area-grid">
                <!-- Sidebar -->
                <div class="client-sidebar">
                    <div style="padding: 0 0 1rem 0.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 0.5rem;">
                        <span style="font-weight: 700; color: var(--text-main);">Hola, ${this.userProfile.name.split(' ')[0]}</span>
                    </div>
                    
                    <button class="nav-btn ${this.currentTab === 'active' ? 'active' : ''}" data-tab="active">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        Pedidos Activos
                    </button>
                    <button class="nav-btn ${this.currentTab === 'history' ? 'active' : ''}" data-tab="history">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Histórico
                    </button>
                    <button class="nav-btn ${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Mi Cuenta
                    </button>
                    
                    <div style="flex:1;"></div>
                    
                    <button id="btn-logout-dynamic" class="nav-btn" style="color: #ef4444;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Cerrar Sesión
                    </button>
                </div>

                <!-- Content -->
                <div class="client-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.currentTab) {
            case 'active':
                return `
                    <h2 class="section-title" style="margin-top:0;">Pedidos en Curso</h2>
                    <div class="order-list">
                        ${this.mockActiveOrders.map(o => this.renderOrderItem(o, true)).join('')}
                    </div>
                `;
            case 'history':
                return `
                    <h2 class="section-title" style="margin-top:0;">Historial de Pedidos</h2>
                    <div class="order-list">
                        ${this.mockOrderHistory.map(o => this.renderOrderItem(o, false)).join('')}
                    </div>
                `;
            case 'profile':
                return `
                    <h2 class="section-title" style="margin-top:0;">Mis Datos</h2>
                    <form class="profile-grid">
                        <div class="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" class="form-input" value="${this.userProfile.name}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-input" value="${this.userProfile.email}" disabled style="opacity:0.7">
                        </div>
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="text" class="form-input" value="${this.userProfile.phone}">
                        </div>
                        <div class="form-group">
                            <label>Dirección Principal</label>
                            <input type="text" class="form-input" value="${this.userProfile.address}">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <button class="btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                `;
        }
    }

    renderOrderItem(order, isActive) {
        // Only active orders might have "Seguimiento" button logic etc.
        const badgeColor = order.status === 'Entregado' ? 'success' : (order.status === 'Devuelto' ? 'danger' : 'warning');

        // Define badge style for 'danger' if needed or just use inline style/class
        let badgeStyle = `badge-${badgeColor}`;
        if (order.status === 'Devuelto') badgeStyle = 'badge-warning'; // reuse warning or add danger style

        return `
            <div class="order-item">
                <div class="order-id">
                    <strong>${order.id}</strong>
                    <span class="order-subtitle">${order.items}</span>
                </div>
                <div class="order-status-wrap">
                    <span class="order-date">${order.date}</span>
                    <span class="${badgeStyle}" style="${order.status === 'Devuelto' ? 'color:#ef4444; background:rgba(239,68,68,0.1);' : ''}">${order.status}</span>
                </div>
                <div class="order-total">
                    ${order.total}
                    ${isActive ? '<br><a href="#" class="tracking-link">Seguimiento</a>' : ''}
                </div>
            </div>
        `;
    }

    attachInternalEvents(container) {
        // Close
        container.querySelector('#client-close-dynamic').addEventListener('click', () => this.close());

        // Login
        const loginForm = container.querySelector('#login-form-dynamic');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Nav Buttons
        container.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Logout
        const logoutBtn = container.querySelector('#btn-logout-dynamic');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }
}
