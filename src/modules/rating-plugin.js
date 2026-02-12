export class RatingPlugin {
    constructor() {
        this.productRatings = {};
        this.scrapyardRatings = {};
        this.initialized = false;
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/RecambioAzul/')) return '/RecambioAzul/';
        return '/';
    }

    async init() {
        try {
            const basePath = this.getBasePath();
            const [resp1, resp2] = await Promise.all([
                fetch(`${basePath}src/data/product-ratings.json?v=${Date.now()}`),
                fetch(`${basePath}src/data/scrapyard-ratings.json?v=${Date.now()}`)
            ]);

            if (resp1.ok) this.productRatings = await resp1.json();
            if (resp2.ok) this.scrapyardRatings = await resp2.json();

            this.initialized = true;
            console.log('RatingPlugin: Data loaded');

            // Initial scan
            this.scanAndInject();

            // Watch for changes
            this.initObserver();

            // Global listener for review buttons
            this.attachGlobalEvents();
        } catch (error) {
            console.warn('RatingPlugin: Failed to initialize ratings:', error);
        }
    }

    renderStars(rating, showNumber = false) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        let html = '<span class="stars">';
        for (let i = 0; i < full; i++) html += '<span class="star filled">★</span>';
        if (half) html += '<span class="star half">★</span>';
        for (let i = 0; i < (5 - full - (half ? 1 : 0)); i++) html += '<span class="star empty">☆</span>';
        html += '</span>';
        if (showNumber) html += ` <span class="rating-num">${rating.toFixed(1)}</span>`;
        return html;
    }

    scanAndInject() {
        if (!this.initialized) return;

        // Inject Product Stars
        document.querySelectorAll('.rating-slot:not(.injected)').forEach(slot => {
            const pid = slot.dataset.pid;
            const rating = this.productRatings[pid];
            if (rating) {
                slot.innerHTML = `
                    <div class="product-rating-compact">
                        ${this.renderStars(rating.averageRating)}
                        <span class="review-count">(${rating.totalReviews})</span>
                    </div>
                `;
            }
            slot.classList.add('injected');
        });

        // Inject Scrapyard Badges
        document.querySelectorAll('.scrapyard-slot:not(.injected)').forEach(slot => {
            const did = slot.dataset.did;
            const scrap = this.scrapyardRatings[did];
            if (scrap) {
                slot.innerHTML = `
                    <div class="scrapyard-badge">
                        <span class="scrapyard-icon">🏭</span>
                        <div class="scrapyard-info">
                            <span class="scrapyard-name">${scrap.name}</span>
                            <div class="scrapyard-rating">
                                ${this.renderStars(scrap.rating)}
                                <span class="scrapyard-sales">${scrap.totalSales} ventas</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            slot.classList.add('injected');
        });

        // Inject Full Reviews View (Details Page)
        document.querySelectorAll('.reviews-container-slot:not(.injected)').forEach(slot => {
            const pid = slot.dataset.pid;
            const rating = this.productRatings[pid];
            slot.innerHTML = this.renderFullReviews(pid, rating);
            slot.classList.add('injected');
        });
    }

    renderFullReviews(pid, rating) {
        let reviewsList = '<p class="no-reviews">Sin valoraciones aún.</p>';
        let summary = '';

        if (rating) {
            summary = `
                <div class="reviews-summary">
                    ${this.renderStars(rating.averageRating, true)}
                    <span class="reviews-total">${rating.totalReviews} valoraciones</span>
                </div>
            `;
            reviewsList = rating.reviews.map(r => `
                <div class="review-card">
                    <div class="review-header">
                        ${this.renderStars(r.rating)}
                        <div class="review-meta">
                            <span class="review-author">${r.author}</span>
                            <span class="review-date">${r.date}</span>
                        </div>
                    </div>
                    <p class="review-comment">${r.comment || ''}</p>
                </div>
            `).join('');
        }

        return `
            <div class="reviews-section">
                <div class="reviews-header">
                    <h3>Valoraciones</h3>
                    ${summary}
                </div>
                <div class="reviews-list">${reviewsList}</div>
                <button class="btn-secondary btn-leave-review" data-pid="${pid}">Escribir Reseña</button>
            </div>
        `;
    }

    initObserver() {
        const observer = new MutationObserver(() => this.scanAndInject());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    attachGlobalEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-leave-review');
            if (btn) this.showReviewModal(btn.dataset.pid);
        });
    }

    showReviewModal(pid) {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <div class="review-modal-header">
                    <h3>Valorar Producto</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="review-modal-body">
                    <div class="star-selector">
                        ${[1, 2, 3, 4, 5].map(n => `<span class="s-opt" data-v="${n}">☆</span>`).join('')}
                    </div>
                    <textarea placeholder="Tu opinión..." rows="4"></textarea>
                    <button class="btn-primary btn-submit-rev">Enviar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        let rating = 0;
        modal.querySelectorAll('.s-opt').forEach(opt => {
            opt.onclick = () => {
                rating = opt.dataset.v;
                modal.querySelectorAll('.s-opt').forEach(s => s.innerText = s.dataset.v <= rating ? '★' : '☆');
            };
        });

        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelector('.btn-submit-rev').onclick = () => {
            if (!rating) return alert('Selecciona estrellas');
            alert('¡Gracias! Tu reseña ha sido enviada (Prueba)');
            modal.remove();
        };
    }
}
