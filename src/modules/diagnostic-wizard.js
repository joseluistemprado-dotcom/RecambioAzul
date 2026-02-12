export class DiagnosticWizard {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.selections = {
            category: null,
            symptom: null,
            answers: {}
        };
        
        // Diagnostic Data Structure
        this.data = [
            {
                id: 'motor',
                label: 'Motor',
                icon: '⚙️',
                symptoms: [
                    {
                        id: 's1',
                        label: 'El motor no arranca',
                        questions: [
                            { id: 'q1', text: '¿Se encienden las luces del tablero al girar la llave?', yes: 'bateria', no: 'alternador' },
                            { id: 'q2', text: '¿Hace un ruido de "clic-clic" al intentar arrancar?', yes: 'motor_arranque', no: 'bateria' }
                        ],
                        diagnoses: {
                            'bateria': { title: 'Fallo de Batería', text: 'La batería podría estar descargada o en mal estado.', parts: ['Batería', 'Cargador'] },
                            'alternador': { title: 'Fallo de Alternador', text: 'El alternador no está cargando la batería correctamente.', parts: ['Alternador'] },
                            'motor_arranque': { title: 'Motor de Arranque', text: 'El motor de arranque podría estar atascado o averiado.', parts: ['Motor de Arranque'] }
                        }
                    },
                    {
                        id: 's2',
                        label: 'Pérdida de potencia',
                        questions: [
                            { id: 'q1', text: '¿Se enciende algún testigo de fallo motor?', yes: 'sensor', no: 'filtro' }
                        ],
                        diagnoses: {
                            'sensor': { title: 'Fallo de Sensor', text: 'Podría ser un fallo en el sensor MAF, MAP o sondas lambda.', parts: ['Sensor MAF', 'Sonda Lambda'] },
                            'filtro': { title: 'Obstrucción', text: 'Filtros de aire o combustible podrían estar sucios.', parts: ['Filtro de Aire', 'Filtro de Combustible'] }
                        }
                    }
                ]
            },
            {
                id: 'frenos',
                label: 'Frenos',
                icon: '🛑',
                symptoms: [
                    {
                        id: 's1',
                        label: 'Ruido al frenar',
                        questions: [
                            { id: 'q1', text: '¿Es un chirrido agudo?', yes: 'pastillas', no: 'discos' }
                        ],
                        diagnoses: {
                            'pastillas': { title: 'Pastillas Desgastadas', text: 'Las pastillas de freno han llegado al final de su vida útil.', parts: ['Pastillas de Freno'] },
                            'discos': { title: 'Discos Dañados', text: 'Los discos podrían estar rayados o alabeados.', parts: ['Discos de Freno'] }
                        }
                    }
                ]
            },
            {
                id: 'bateria',
                label: 'Batería / Eléctrico',
                icon: '🔋',
                symptoms: [
                    {
                        id: 's1',
                        label: 'Descarga rápida (EV)',
                        questions: [
                            { id: 'q1', text: '¿Ocurre principalmente en invierno?', yes: 'clima', no: 'celda' }
                        ],
                        diagnoses: {
                            'clima': { title: 'Efecto del Frío', text: 'El frío reduce la eficiencia. Considere precalentar la batería.', parts: ['Gestión Térmica'] },
                            'celda': { title: 'Degradación de Celdas', text: 'Posible desbalanceo o degradación prematura de celdas.', parts: ['Módulo de Batería'] }
                        }
                    }
                ]
            },
             {
                id: 'luces',
                label: 'Iluminación',
                icon: '💡',
                symptoms: [
                    {
                        id: 's1',
                        label: 'Faro no enciende',
                        questions: [
                             { id: 'q1', text: '¿Es un faro LED o Xenon?', yes: 'balastro', no: 'bombilla' }
                        ],
                         diagnoses: {
                            'balastro': { title: 'Fallo de Balastro/Driver', text: 'En faros modernos, suele fallar la unidad de control antes que el LED.', parts: ['Balastro', 'Centralita Faro'] },
                            'bombilla': { title: 'Bombilla Fundida', text: 'La bombilla halógena se ha fundido.', parts: ['Bombilla'] }
                        }
                    }
                ]
            },
            {
                id: 'clima',
                label: 'Climatización',
                icon: '❄️',
                symptoms: [
                    {
                        id: 's1',
                        label: 'No enfría',
                        questions: [
                            { id: 'q1', text: '¿Sale aire pero no está frío?', yes: 'gas', no: 'ventilador' }
                        ],
                         diagnoses: {
                            'gas': { title: 'Falta de Gas', text: 'Posible fuga en el circuito de refrigerante.', parts: ['Compresor', 'Condensador'] },
                            'ventilador': { title: 'Fallo de Ventilador', text: 'El ventilador del habitáculo no funciona.', parts: ['Ventilador Habitáculo', 'Resistencia'] }
                        }
                    }
                ]
            }
        ];
    }

    init() {
        if (!this.container) return;
        this.renderStart();
        
        // Listen for reset events or initial navigation
        document.addEventListener('reset-wizard', () => this.reset());
    }

    reset() {
        this.currentStep = 0;
        this.selections = { category: null, symptom: null, answers: {} };
        this.renderStart();
    }

    renderStart() {
        this.container.innerHTML = `
            <div class="wizard-header">
                <h2>Asistente de Diagnóstico</h2>
                <p>Identifica el problema de tu vehículo paso a paso.</p>
                 <div class="wizard-progress">
                    <div class="step active">1</div>
                    <div class="step">2</div>
                    <div class="step">3</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <h3>¿Qué tipo de problema tiene tu vehículo?</h3>
                <div class="wizard-grid">
                    ${this.data.map(cat => `
                        <button class="wizard-card" data-category="${cat.id}">
                            <span class="wizard-icon">${cat.icon}</span>
                            <span class="wizard-label">${cat.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.container.querySelectorAll('.wizard-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const catId = btn.dataset.category;
                this.selections.category = this.data.find(d => d.id === catId);
                this.renderSymptoms();
            });
        });
    }

    renderSymptoms() {
        if (!this.selections.category) return;
        
        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-back">← Volver</button>
                <h2>${this.selections.category.label}</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step active">2</div>
                    <div class="step">3</div>
                </div>
            </div>
            <div class="wizard-content fade-in">
                <h3>Selecciona el síntoma principal:</h3>
                <div class="wizard-list">
                    ${this.selections.category.symptoms.map(sym => `
                        <button class="wizard-list-item" data-symptom="${sym.id}">
                            ${sym.label}
                            <span class="arrow">→</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.container.querySelector('.btn-back').addEventListener('click', () => this.renderStart());
        
        this.container.querySelectorAll('.wizard-list-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const symId = btn.dataset.symptom;
                this.selections.symptom = this.selections.category.symptoms.find(s => s.id === symId);
                this.renderQuestion(0);
            });
        });
    }

    renderQuestion(index) {
        if (!this.selections.symptom) return;
        
        const question = this.selections.symptom.questions[index];
        
        // If no more questions, determine result (simplified logic for demo: last answer determines result if linear)
        // ideally logic tree would be more complex
        if (!question) {
            // Fallback if no questions or end of chain
             this.renderResult(this.selections.symptom.diagnoses[Object.keys(this.selections.symptom.diagnoses)[0]]);
             return;
        }

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-back">← Volver</button>
                 <h2>Diagnóstico en curso...</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step completed">2</div>
                    <div class="step active">3</div>
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
                 // Default logic fallback
                 this.renderResult(this.selections.symptom.diagnoses[Object.keys(this.selections.symptom.diagnoses)[0]]);
            }
        });

        this.container.querySelector('.no').addEventListener('click', () => {
             if (question.no && this.selections.symptom.diagnoses[question.no]) {
                this.renderResult(this.selections.symptom.diagnoses[question.no]);
            } else if (this.selections.symptom.questions[index + 1]) {
                this.renderQuestion(index + 1);
            } else {
                 // Default logic fallback
                 this.renderResult(this.selections.symptom.diagnoses[Object.keys(this.selections.symptom.diagnoses)[1] || Object.keys(this.selections.symptom.diagnoses)[0]]);
            }
        });
    }

    renderResult(diagnosis) {
        if (!diagnosis) return;

        this.container.innerHTML = `
            <div class="wizard-header">
                <button class="btn-text btn-restart">↺ Empezar de nuevo</button>
                <h2>Resultado del Diagnóstico</h2>
                 <div class="wizard-progress">
                    <div class="step completed">1</div>
                    <div class="step completed">2</div>
                    <div class="step completed">3</div>
                </div>
            </div>
            <div class="wizard-content fade-in result-view">
                <div class="result-card">
                    <div class="result-icon">⚠️</div>
                    <h3>${diagnosis.title}</h3>
                    <p>${diagnosis.text}</p>
                    
                    <div class="recommended-parts">
                        <h4>Piezas Relacionadas:</h4>
                        <div class="tags">
                            ${diagnosis.parts.map(p => `<span class="tag">${p}</span>`).join('')}
                        </div>
                    </div>
                    
                    <button class="btn-primary btn-search-parts">Ver Recambios Disponibles</button>
                </div>
            </div>
        `;

        this.container.querySelector('.btn-restart').addEventListener('click', () => this.reset());
        this.container.querySelector('.btn-search-parts').addEventListener('click', () => {
            // Trigger search with the first part name
            const searchTerm = diagnosis.parts[0];
            const searchInput = document.getElementById('main-search-input');
             if (searchInput) {
                searchInput.value = searchTerm;
                document.dispatchEvent(new CustomEvent('search-query', { detail: searchTerm }));
                
                // Navigate to home logic setup
                 window.location.hash = '#/';
                 setTimeout(() => {
                     const target = document.getElementById('product-list-container');
                     if(target) target.scrollIntoView({behavior: 'smooth'});
                 }, 500);
            }
        });
    }
}
