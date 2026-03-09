import { diagnosticData } from '../data/diagnostics.js';

export class DiagnosticWizard {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.currentStep = 0; // 0: Engine Select, 1: Category, 2: Symptom, 3: Questions, 4: Result
        this.selections = {
            engineType: null, // 'electric', 'gasoline', 'diesel'
            category: null,
            symptom: null,
            answers: {}
        };

        // Data Structures
        this.data = diagnosticData;
    }

    init() {
        if (!this.container) return;
        this.renderEngineSelect();
        document.addEventListener('reset-wizard', () => this.reset());
    }

    reset() {
        this.currentStep = 0;
        this.selections = { engineType: null, category: null, symptom: null, answers: {} };
        this.renderEngineSelect();
    }

    // Step 0: Select Engine
    renderEngineSelect() {
        this.currentStep = 0;
        this.container.innerHTML = `
            <div class="wizard-header">
                <h2>Asistente de Diagnóstico</h2>
                <p>Para empezar, selecciona el tipo de motor de tu vehículo.</p>
                <div class="wizard-progress">
                    <div class="step active">1</div>
                    <div class="step">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <div class="wizard-grid">
                    <button class="wizard-card engine-select" data-engine="electric">
                        <span class="wizard-icon">⚡</span>
                        <span class="wizard-label">Eléctrico / Híbrido</span>
                    </button>
                    <button class="wizard-card engine-select" data-engine="gasoline">
                        <span class="wizard-icon">⛽</span>
                        <span class="wizard-label">Gasolina</span>
                    </button>
                    <button class="wizard-card engine-select" data-engine="diesel">
                        <span class="wizard-icon">🛢️</span>
                        <span class="wizard-label">Diésel</span>
                    </button>
                </div>
            </div>
        `;

        this.container.querySelectorAll('.engine-select').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selections.engineType = btn.dataset.engine;
                this.renderCategories();
            });
        });
    }

    // Step 1: Select Category (Merged Specific + Shared)
    renderCategories() {
        this.currentStep = 1;
        const specificData = this.data[this.selections.engineType] || [];
        const sharedData = this.data.shared || [];
        const combinedCategories = [...specificData, ...sharedData];

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-back">← Volver</button>
                <h2>Categoría del Problema</h2>
                <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step active">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <h3>¿Qué sistema está fallando?</h3>
                <div class="wizard-grid">
                    ${combinedCategories.map(cat => `
                        <button class="wizard-card" data-cat-id="${cat.id}">
                            <span class="wizard-icon">${cat.icon}</span>
                            <span class="wizard-label">${cat.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.container.querySelector('.btn-back').addEventListener('click', () => this.renderEngineSelect());

        this.container.querySelectorAll('.wizard-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const catId = btn.dataset.catId;
                this.selections.category = combinedCategories.find(c => c.id === catId);
                this.renderSymptoms();
            });
        });
    }

    // Step 2: Symptoms
    renderSymptoms() {
        if (!this.selections.category) return;
        this.currentStep = 2;

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-back">← Volver</button>
                <h2>${this.selections.category.label}</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step completed">2</div>
                    <div class="step active">3</div>
                    <div class="step">4</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <h3>Selecciona el síntoma:</h3>
                <div class="wizard-list">
                    ${this.selections.category.symptoms.map(sym => `
                        <button class="wizard-list-item" data-sym-id="${sym.id}">
                            ${sym.label}
                            <span class="arrow">→</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.container.querySelector('.btn-back').addEventListener('click', () => this.renderCategories());

        this.container.querySelectorAll('.wizard-list-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const symId = btn.dataset.symId;
                this.selections.symptom = this.selections.category.symptoms.find(s => s.id === symId);
                this.renderQuestion(0);
            });
        });
    }

    // Step 3: Questions
    renderQuestion(index) {
        if (!this.selections.symptom) return;
        this.currentStep = 3;

        const question = this.selections.symptom.questions[index];

        if (!question) {
            // Default logic to first result if no question logic matches
            const keys = Object.keys(this.selections.symptom.diagnoses);
            this.renderResult(this.selections.symptom.diagnoses[keys[0]]);
            return;
        }

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-back">← Volver</button>
                 <h2>Diagnóstico</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step completed">2</div>
                    <div class="step completed">3</div>
                    <div class="step active">4</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <div class="question-box">
                    <h3>${question.text}</h3>
                    <div class="wizard-actions">
                        <button class="btn-wizard-action yes">SÍ</button>
                        <button class="btn-wizard-action no">NO</button>
                    </div>
                </div>
            </div>
        `;

        this.container.querySelector('.btn-back').addEventListener('click', () => this.renderSymptoms());

        this.container.querySelector('.yes').addEventListener('click', () => {
            if (question.yes && this.selections.symptom.diagnoses[question.yes]) {
                this.renderResult(this.selections.symptom.diagnoses[question.yes]);
            } else if (this.selections.symptom.questions[index + 1]) {
                this.renderQuestion(index + 1);
            } else {
                this.renderResult(this.selections.symptom.diagnoses[Object.keys(this.selections.symptom.diagnoses)[0]]);
            }
        });

        this.container.querySelector('.no').addEventListener('click', () => {
            if (question.no && this.selections.symptom.diagnoses[question.no]) {
                this.renderResult(this.selections.symptom.diagnoses[question.no]);
            } else if (this.selections.symptom.questions[index + 1]) {
                this.renderQuestion(index + 1);
            } else {
                const keys = Object.keys(this.selections.symptom.diagnoses);
                this.renderResult(this.selections.symptom.diagnoses[keys[1] || keys[0]]);
            }
        });
    }

    // Step 4: Result
    renderResult(diagnosis) {
        if (!diagnosis) return;
        this.currentStep = 4;

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-restart">↺ Inicio</button>
                <h2>Resultado</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step completed">2</div>
                    <div class="step completed">3</div>
                    <div class="step completed">4</div>
                </div>
            </div>
            <div class="wizard-content fade-in result-view">
                <div class="result-card">
                    <div class="result-icon">⚠️</div>
                    <h3>${diagnosis.title}</h3>
                    <p>${diagnosis.text}</p>
                    
                    <div class="recommended-parts">
                        <h4>Solución Recomendada:</h4>
                        <div class="parts-list-wizard">
                            ${diagnosis.parts.map((p, idx) => `
                                <div class="part-item-wizard">
                                    <div class="part-info-w">
                                        <span class="part-name-w">${p.name}</span>
                                        <span class="part-price-w">~${p.price}€</span>
                                    </div>
                                    <button class="btn-primary btn-sm btn-add-wizard" data-idx="${idx}">
                                        Añadir al Carrito
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.querySelector('.btn-restart').addEventListener('click', () => this.reset());

        // Handle "Add to Cart"
        this.container.querySelectorAll('.btn-add-wizard').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                const part = diagnosis.parts[idx];

                // Construct a product object for the cart
                const product = {
                    id: `diag-${Date.now()}-${idx}`, // Generate unique ID
                    name: part.name,
                    price: part.price,
                    image: 'src/assets/logo.png', // Placeholder
                    category: 'Diagnostic'
                };

                // Dispatch event for Cart.js
                document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));

                // Visual feedback
                const originalText = e.currentTarget.textContent;
                e.currentTarget.textContent = '¡Añadido!';
                e.currentTarget.classList.add('btn-success');
                setTimeout(() => {
                    e.currentTarget.textContent = originalText;
                    e.currentTarget.classList.remove('btn-success');
                }, 1500);
            });
        });
    }
}
