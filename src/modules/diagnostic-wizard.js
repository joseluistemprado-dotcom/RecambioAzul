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
        this.data = {
            electric: [ /* Existing EV Data + Expanded */
                {
                    id: 'bateria_carga',
                    label: 'Batería y Carga',
                    icon: '🔋',
                    symptoms: [
                        {
                            id: 's_no_carga',
                            label: 'El coche no carga al enchufarlo',
                            questions: [
                                { id: 'q1', text: '¿El puerto de carga parpadea en rojo?', yes: 'fallo_puerto', no: 'q2' },
                                { id: 'q2', text: '¿Has probado en otro cargador diferente?', yes: 'obc', no: 'cargador_externo' }
                            ],
                            diagnoses: {
                                'fallo_puerto': { title: 'Fallo en Puerto de Carga', text: 'El puerto de carga detecta error.', parts: [{ name: 'Puerto de Carga CCS2', price: 250 }, { name: 'Actuador Bloqueo', price: 45 }] },
                                'obc': { title: 'Fallo Cargador de a Bordo', text: 'El OBC no gestiona la carga.', parts: [{ name: 'Cargador a Bordo (OBC)', price: 1200 }, { name: 'Fusible HV', price: 15 }] },
                                'cargador_externo': { title: 'Revisar Cargador Externo', text: 'El problema parece del poste o cable.', parts: [{ name: 'Cable Tipo 2 Mennekes', price: 180 }] }
                            }
                        },
                        {
                            id: 's_autonomia',
                            label: 'Autonomía reducida drásticamente',
                            questions: [
                                { id: 'q1', text: '¿Ocurre solo en invierno?', yes: 'frio', no: 'degradacion' }
                            ],
                            diagnoses: {
                                'frio': { title: 'Batería Fría', text: 'La química de la batería rinde menos en frío.', parts: [{ name: 'Manta Térmica Batería', price: 120 }] },
                                'degradacion': { title: 'Degradación Batería', text: 'Pérdida de capacidad (SOH).', parts: [{ name: 'Módulo Batería Reacondicionado', price: 800 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'motor_ev',
                    label: 'Motor Eléctrico',
                    icon: '⚡',
                    symptoms: [
                        {
                            id: 's_ruido_motor',
                            label: 'Zumbido agudo al acelerar',
                            questions: [{ id: 'q1', text: '¿Aumenta con la velocidad?', yes: 'rodamiento', no: 'inversor' }],
                            diagnoses: {
                                'rodamiento': { title: 'Rodamiento Motor', text: 'Desgaste mecánico.', parts: [{ name: 'Kit Reparación Motor', price: 350 }] },
                                'inversor': { title: 'Ruido Inversor', text: 'Coil whine excesivo en electrónica.', parts: [{ name: 'Inversor Potencia', price: 1500 }] }
                            }
                        }
                    ]
                }
            ],
            gasoline: [
                {
                    id: 'motor_gasolina',
                    label: 'Motor Gasolina',
                    icon: '⛽',
                    symptoms: [
                        {
                            id: 's_no_arranca',
                            label: 'No arranca (hace ruido de intento)',
                            questions: [
                                { id: 'q1', text: '¿Huele a gasolina?', yes: 'ahogado', no: 'bomba_gasolina' }
                            ],
                            diagnoses: {
                                'ahogado': { title: 'Motor Ahogado / Bujías', text: 'Exceso de combustible o falta de chispa.', parts: [{ name: 'Juego de Bujías', price: 40 }, { name: 'Bobina de Encendido', price: 35 }] },
                                'bomba_gasolina': { title: 'Fallo Bomba Gasolina', text: 'No llega combustible al motor.', parts: [{ name: 'Bomba de Combustible', price: 120 }, { name: 'Relé Bomba', price: 15 }] }
                            }
                        },
                        {
                            id: 's_tirones',
                            label: 'Tirones al acelerar',
                            questions: [
                                { id: 'q1', text: '¿Se enciende luz de fallo motor?', yes: 'bobina', no: 'filtro' }
                            ],
                            diagnoses: {
                                'bobina': { title: 'Fallo de Encendido (Misfire)', text: 'Una bobina o bujía está fallando.', parts: [{ name: 'Bobina de Encendido', price: 45 }, { name: 'Bujías Iridio', price: 60 }] },
                                'filtro': { title: 'Filtro Combustible Sucio', text: 'Flujo de gasolina restringido.', parts: [{ name: 'Filtro Gasolina', price: 20 }] }
                            }
                        },
                        {
                            id: 's_humo',
                            label: 'Humo por el escape',
                            questions: [
                                { id: 'q1', text: '¿El humo es azulado?', yes: 'aceite', no: 'agua' }
                            ],
                            diagnoses: {
                                'aceite': { title: 'Consumo de Aceite', text: 'Retenes de válvula o segmentos desgastados.', parts: [{ name: 'Juego Juntas Válvula', price: 80 }, { name: 'Segmentos Pistón', price: 150 }] },
                                'agua': { title: 'Junta de Culata', text: 'Humo blanco denso: anticongelante en cámara.', parts: [{ name: 'Junta de Culata', price: 60 }, { name: 'Kit Rectificado', price: 300 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'escape_gasolina',
                    label: 'Escape y Emisiones',
                    icon: '💨',
                    symptoms: [
                        {
                            id: 's_ruido_escape',
                            label: 'Ruido fuerte en escape',
                            questions: [{ id: 'q1', text: '¿Suena debajo del coche?', yes: 'intermedio', no: 'final' }],
                            diagnoses: {
                                'intermedio': { title: 'Silencioso Intermedio Roto', text: 'Fuga en tramo medio.', parts: [{ name: 'Silencioso Intermedio', price: 90 }] },
                                'final': { title: 'Silencioso Trasero Picado', text: 'Óxido en la cola de escape.', parts: [{ name: 'Silencioso Trasero', price: 110 }] }
                            }
                        }
                    ]
                }
            ],
            diesel: [
                {
                    id: 'motor_diesel',
                    label: 'Motor Diésel',
                    icon: '🛢️',
                    symptoms: [
                        {
                            id: 's_humo_negro',
                            label: 'Humo negro al acelerar',
                            questions: [
                                { id: 'q1', text: '¿Pierde potencia?', yes: 'egr', no: 'inyector' }
                            ],
                            diagnoses: {
                                'egr': { title: 'Válvula EGR Sucia/Abierta', text: 'Recirculación de gases bloqueada abierta.', parts: [{ name: 'Válvula EGR', price: 140 }, { name: 'Spray Limpia EGR', price: 15 }] },
                                'inyector': { title: 'Inyector Goteando', text: 'Exceso de combustible no quemado.', parts: [{ name: 'Inyector Diésel', price: 250 }] }
                            }
                        },
                        {
                            id: 's_cuesta_arrancar',
                            label: 'Cuesta arrancar en frío',
                            questions: [
                                { id: 'q1', text: '¿Se enciende testigo de muelle?', yes: 'calentadores', no: 'bomba' }
                            ],
                            diagnoses: {
                                'calentadores': { title: 'Calentadores Fundidos', text: 'Las bujías de precalentamiento no funcionan.', parts: [{ name: 'Juego Calentadores', price: 60 }, { name: 'Relé Calentadores', price: 40 }] },
                                'bomba': { title: 'Descebe Circuito Gasoil', text: 'Aire en el circuito de baja presión.', parts: [{ name: 'Bomba Cebado', price: 30 }, { name: 'Válvula Antirretorno', price: 10 }] }
                            }
                        },
                        {
                            id: 's_filtro_particulas',
                            label: 'Aviso Filtro Partículas (DPF)',
                            questions: [
                                { id: 'q1', text: '¿Haces mucha ciudad?', yes: 'regeneracion_fallida', no: 'sensor_presion' }
                            ],
                            diagnoses: {
                                'regeneracion_fallida': { title: 'DPF Saturado', text: 'El filtro no ha podido regenerar por trayectos cortos.', parts: [{ name: 'Líquido Limpia DPF', price: 25 }, { name: 'Filtro DPF Nuevo', price: 450 }] },
                                'sensor_presion': { title: 'Sensor Diferencial Presión', text: 'El sensor lee mal la saturación.', parts: [{ name: 'Sensor Presión DPF', price: 50 }] }
                            }
                        }
                    ]
                }
            ],
            shared: [ // Common for all (Suspension, Brakes, AC, Body)
                {
                    id: 'frenos',
                    label: 'Frenos',
                    icon: '🛑',
                    symptoms: [
                        {
                            id: 's_chirrido',
                            label: 'Chirrido al frenar',
                            questions: [{ id: 'q1', text: '¿Es constante?', yes: 'pastillas', no: 'suciedad' }],
                            diagnoses: {
                                'pastillas': { title: 'Pastillas Gastadas', text: 'Metal contra metal.', parts: [{ name: 'Juego Pastillas Freno', price: 45 }, { name: 'Testigo Desgaste', price: 12 }] },
                                'suciedad': { title: 'Suciedad en Discos', text: 'Polvo acumulado.', parts: [{ name: 'Limpiador Frenos', price: 8 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'suspension',
                    label: 'Suspensión',
                    icon: '🔩',
                    symptoms: [
                        {
                            id: 's_golpe',
                            label: 'Golpe seco en baches',
                            questions: [{ id: 'q1', text: '¿Suena "clonc"?', yes: 'bieleta', no: 'amortiguador' }],
                            diagnoses: {
                                'bieleta': { title: 'Bieleta Estabilizadora', text: 'Holgura en rótula.', parts: [{ name: 'Bieleta Suspensión', price: 25 }] },
                                'amortiguador': { title: 'Amortiguador Reventado', text: 'Pérdida de aceite/gas.', parts: [{ name: 'Juego Amortiguadores', price: 180 }, { name: 'Copelas', price: 40 }] }
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
                            id: 's_no_enfria',
                            label: 'No enfría nada',
                            questions: [{ id: 'q1', text: '¿Se oye el compresor?', yes: 'gas', no: 'compresor' }],
                            diagnoses: {
                                'gas': { title: 'Falta de Gas', text: 'Fuga en el circuito.', parts: [{ name: 'Kit Fuga AC', price: 30 }] },
                                'compresor': { title: 'Fallo Compresor', text: 'El embrague del compresor no acopla.', parts: [{ name: 'Compresor Aire Acondicionado', price: 250 }] }
                            }
                        }
                    ]
                }
            ]
        };
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
