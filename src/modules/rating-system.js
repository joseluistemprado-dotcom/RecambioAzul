export class RatingSystem {
    constructor() {
        this.productRatings = {};
        this.scrapyardRatings = {};
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/RecambioAzul/')) {
            return '/RecambioAzul/';
        }
        return '/';
    }

    async init() {
        try {
            const basePath = this.getBasePath();

            // Load product ratings
            const ratingsResponse = await fetch(`${basePath}src/data/product-ratings.json?v=${Date.now()}`);
            this.productRatings = await ratingsResponse.json();

            // Load scrapyard ratings
            const scrapyardResponse = await fetch(`${basePath}src/data/scrapyard-ratings.json?v=${Date.now()}`);
            this.scrapyardRatings = await scrapyardResponse.json();

            console.log('RatingSystem Initialized');
        } catch (error) {
            console.error('Error loading ratings:', error);
        }
    }

    // Render star rating (visual only)
    renderStars(rating, showNumber = true) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '<span class="stars">';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star filled">★</span>';
        }

        // Half star
        if (hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">☆</span>';
        }

        starsHTML += '</span>';

        if (showNumber) {
            starsHTML += ` <span class="rating-number">${rating.toFixed(1)}</span>`;
        }

        return starsHTML;
    }

    // Get rating data for a product
    getProductRating(productId) {
        return this.productRatings[productId] || null;
    }

    // Get scrapyard rating
    getScrapyardRating(donorId) {
        return this.scrapyardRatings[donorId] || null;
    }

    // Render compact rating for product cards
    renderCompactRating(productId) {
        const rating = this.getProductRating(productId);
        if (!rating) return '';

        return `
            <div class="product-rating-compact">
                ${this.renderStars(rating.averageRating, false)}
                <span class="review-count">(${rating.totalReviews})</span>
            </div>
        `;
    }

    // Render scrapyard badge
    renderScrapyardBadge(donorId) {
        const scrapyard = this.getScrapyardRating(donorId);
        if (!scrapyard) return '';

        return `
            <div class="scrapyard-badge">
                <span class="scrapyard-icon">🏭</span>
                <div class="scrapyard-info">
                    <span class="scrapyard-name">${scrapyard.name}</span>
                    <div class="scrapyard-rating">
                        ${this.renderStars(scrapyard.rating, false)}
                        <span class="scrapyard-sales">${scrapyard.totalSales} ventas</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Render full reviews section for product details
    renderReviewsSection(productId) {
        const rating = this.getProductRating(productId);
        if (!rating) {
            return `
                <div class="reviews-section">
                    <h3>Valoraciones</h3>
                    <p class="no-reviews">Este producto aún no tiene valoraciones.</p>
                    <button class="btn-secondary btn-leave-review" data-product-id="${productId}">
                        Dejar Valoración
                    </button>
                </div>
            `;
        }

        const reviewsHTML = rating.reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-rating">
                        ${this.renderStars(review.rating, false)}
                    </div>
                    <div class="review-meta">
                        <span class="review-author">${review.author}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                ${review.comment ? `<p class="review-comment">${review.comment}</p>` : ''}
            </div>
        `).join('');

        return `
            <div class="reviews-section">
                <div class="reviews-header">
                    <h3>Valoraciones</h3>
                    <div class="reviews-summary">
                        ${this.renderStars(rating.averageRating, true)}
                        <span class="reviews-total">${rating.totalReviews} valoraciones</span>
                    </div>
                </div>
                <div class="reviews-list">
                    ${reviewsHTML}
                </div>
                <button class="btn-secondary btn-leave-review" data-product-id="${productId}">
                    Dejar Valoración
                </button>
            </div>
        `;
    }

    // Show review submission modal
    showReviewModal(productId) {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <div class="review-modal-header">
                    <h3>Dejar Valoración</h3>
                    <button class="review-modal-close">&times;</button>
                </div>
                <div class="review-modal-body">
                    <div class="star-selector">
                        <span class="star-select" data-rating="1">☆</span>
                        <span class="star-select" data-rating="2">☆</span>
                        <span class="star-select" data-rating="3">☆</span>
                        <span class="star-select" data-rating="4">☆</span>
                        <span class="star-select" data-rating="5">☆</span>
                    </div>
                    <textarea class="review-comment-input" placeholder="Cuéntanos tu experiencia (opcional)" rows="4"></textarea>
                    <button class="btn-primary btn-submit-review">Enviar Valoración</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Star selection logic
        let selectedRating = 0;
        const stars = modal.querySelectorAll('.star-select');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                stars.forEach((s, idx) => {
                    s.textContent = idx < selectedRating ? '★' : '☆';
                    s.classList.toggle('selected', idx < selectedRating);
                });
            });
        });

        // Close modal
        const closeBtn = modal.querySelector('.review-modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Submit review (mock)
        const submitBtn = modal.querySelector('.btn-submit-review');
        submitBtn.addEventListener('click', () => {
            if (selectedRating === 0) {
                alert('Por favor, selecciona una puntuación');
                return;
            }
            const comment = modal.querySelector('.review-comment-input').value;

            // Mock submission
            alert(`¡Gracias por tu valoración!\nPuntuación: ${selectedRating} estrellas\nComentario: ${comment || 'Sin comentario'}`);
            document.body.removeChild(modal);
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Attach global event listeners for review buttons
    attachGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-leave-review')) {
                const productId = e.target.dataset.productId;
                this.showReviewModal(productId);
            }
        });
    }
}
