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
            electric: [
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
                                'fallo_puerto': { title: 'Fallo en Puerto de Carga (DTC B1234)', text: 'El puerto de carga detecta error de hardware o comunicación.', parts: [{ name: 'Puerto de Carga CCS2', price: 250 }, { name: 'Actuador Bloqueo', price: 45 }] },
                                'obc': { title: 'Fallo Cargador a Bordo (OBC)', text: 'El inversor interno AC/DC no gestiona la carga.', parts: [{ name: 'Cargador a Bordo (OBC)', price: 1200 }, { name: 'Fusible Alta Tensión HV', price: 15 }] },
                                'cargador_externo': { title: 'Error de Infraestructura Exterior', text: 'El problema parece del poste o cable de carga.', parts: [{ name: 'Cable Tipo 2 Mennekes', price: 180 }] }
                            }
                        },
                        {
                            id: 's_autonomia',
                            label: 'Pérdida súbita de autonomía',
                            questions: [{ id: 'q1', text: '¿Se ha degradado con el tiempo?', yes: 'soh_bajo', no: 'celda_desequilibrada' }],
                            diagnoses: {
                                'soh_bajo': { title: 'Degradación Química (SOH < 70%)', text: 'La batería ha perdido capacidad por ciclos de uso.', parts: [{ name: 'Módulo Batería Reacondicionado', price: 800 }] },
                                'celda_desequilibrada': { title: 'Desequilibrio de Celdas (BMS Error)', text: 'Alguna celda tiene diferente voltaje al resto.', parts: [{ name: 'Actualización BMS y Equilibrado', price: 150 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'turbo_admision',
                    label: 'Turbo y Admisión',
                    icon: '🐌',
                    symptoms: [
                        {
                            id: 's_silbido_turbo',
                            label: 'Silbido fuerte al acelerar (Sonido Sirena)',
                            questions: [{ id: 'q1', text: '¿Echa humo azulado por el escape?', yes: 'holgura_turbo', no: 'fuga_manguito' }],
                            diagnoses: {
                                'holgura_turbo': { title: 'Holgura en Eje del Turbo', text: 'Desgaste severo en rodamientos, riesgo de rotura inminente.', parts: [{ name: 'Turbo Reconstruido', price: 450 }, { name: 'Juego Juntas Turbo', price: 25 }] },
                                'fuga_manguito': { title: 'Fuga de Presión en Admisión', text: 'Un manguito del intercooler está rajado o suelto.', parts: [{ name: 'Manguito Intercooler Reforzado', price: 65 }] }
                            }
                        },
                        {
                            id: 's_geometria',
                            label: 'Corte de potencia a altas vueltas (Limp Mode)',
                            questions: [{ id: 'q1', text: '¿Falla solo al pisar fuerte?', yes: 'geometria_atascada', no: 'actuador_turbo' }],
                            diagnoses: {
                                'geometria_atascada': { title: 'Geometría Variable Sucia (P0299)', text: 'Exceso de carbonilla bloquea los álabes del turbo.', parts: [{ name: 'Limpieza Turbo Descarbonizadora', price: 120 }, { name: 'Turbo Nuevo', price: 650 }] },
                                'actuador_turbo': { title: 'Fallo Actuador Electrónico', text: 'El motor que regula la presión no responde.', parts: [{ name: 'Actuador Turbo Electrónico', price: 180 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'refrigeracion',
                    label: 'Sist. Refrigeración',
                    icon: '🌡️',
                    symptoms: [
                        {
                            id: 's_calienta',
                            label: 'La temperatura sube al máximo',
                            questions: [{ id: 'q1', text: '¿Sale aire frío por la calefacción?', yes: 'aire_circuito', no: 'termostato_pegado' }],
                            diagnoses: {
                                'aire_circuito': { title: 'Aire en el Circuito / Fuga', text: 'Nivel bajo de anticongelante por fuga técnica.', parts: [{ name: 'Bomba de Agua GMB', price: 55 }, { name: 'Garrafa Anticongelante G12', price: 18 }] },
                                'termostato_pegado': { title: 'Termostato Bloqueado Cerrado', text: 'No permite el flujo de agua hacia el radiador.', parts: [{ name: 'Termostato con Cuerpo', price: 40 }] }
                            }
                        },
                        {
                            id: 's_humo_blanco',
                            label: 'Humo blanco denso por el escape (Olor dulce)',
                            questions: [{ id: 'q1', text: '¿Hay aceite en el agua (mayonesa)?', yes: 'culata', no: 'enfriador_aceite' }],
                            diagnoses: {
                                'culata': { title: 'Junta de Culata Quemada', text: 'Paso de anticongelante a los cilindros.', parts: [{ name: 'Kit Juntas Descarbonización', price: 150 }, { name: 'Tornillos Culata', price: 35 }] },
                                'enfriador_aceite': { title: 'Fallo Enfriador de Aceite', text: 'Mezcla de fluidos por rotura interna del intercambiador.', parts: [{ name: 'Enfriador de Aceite', price: 90 }] }
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
                            id: 's_misfire',
                            label: 'Motor vibra y pierde potencia (Check Engine parpadea)',
                            questions: [{ id: 'q1', text: '¿Solo en frío?', yes: 'bujias_humedas', no: 'bobina_falla' }],
                            diagnoses: {
                                'bujias_humedas': { title: 'Bujías Incrustadas (Contaminadas)', text: 'Mala combustión por bujías viejas.', parts: [{ name: 'Juego Bujías Iridio Ngk', price: 60 }] },
                                'bobina_falla': { title: 'Fallo Bobina de Encendido (P0300)', text: 'Falta de chispa en uno o más cilindros.', parts: [{ name: 'Bobina de Encendido', price: 45 }] }
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
                            id: 's_adblue',
                            label: 'Fallo sistema AdBlue (Cuenta atrás)',
                            questions: [{
                                id: 'q1', text: '¿Hay cristalización?', yes: 'inyector_adblue', no: 'bomba_urea'
                            }],
                            diagnoses: {
                                'inyector_adblue': { title: 'Inyector Urea Obstruido', text: 'Cristales de AdBlue bloquean la inyección.', parts: [{ name: 'Inyector Adblue', price: 140 }, { name: 'Limpiador Adblue', price: 15 }] },
                                'bomba_urea': { title: 'Fallo Bomba Tanque Adblue', text: 'Pérdida de presión en el circuito SCR.', parts: [{ name: 'Depósito Urea Completo', price: 450 }] }
                            }
                        }
                    ]
                }
            ],
            shared: [
                {
                    id: 'frenos_pro',
                    label: 'Frenos ABS/ESP',
                    icon: '🛑',
                    symptoms: [
                        {
                            id: 's_abs',
                            label: 'Testigo ABS/ESP encendido',
                            questions: [{ id: 'q1', text: '¿Ha fallado tras cambiar ruedas?', yes: 'sensor_abs_sucio', no: 'centralita_abs' }],
                            diagnoses: {
                                'sensor_abs_sucio': { title: 'Sensor de Rueda Defectuoso', text: 'Lectura incorrecta de velocidad de rueda.', parts: [{ name: 'Sensor ABS', price: 25 }] },
                                'centralita_abs': { title: 'Fallo Módulo Hidráulico ABS', text: 'Fallo interno en la electrónica de frenado.', parts: [{ name: 'Modulo ABS Reconstruido', price: 300 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'chasis_ruedas',
                    label: 'Chasis y Neumáticos',
                    icon: '🚜',
                    symptoms: [
                        {
                            id: 's_desgaste_irregular',
                            label: 'Desgaste por los bordes (Tire Wear Diagnostics)',
                            questions: [{ id: 'q1', text: '¿Vibra el volante a partir de 100km/h?', yes: 'equilibrado_alineado', no: 'silentblocks' }],
                            diagnoses: {
                                'equilibrado_alineado': { title: 'Desalineación y Mal Equilibrado', text: 'Geometría de dirección fuera de cotas.', parts: [{ name: 'Neumático 205/55 R16', price: 65 }, { name: 'Alineado 3D', price: 50 }] },
                                'silentblocks': { title: 'Silentblocks de Trapecio Rajados', text: 'Holgura en brazos de suspensión.', parts: [{ name: 'Kit Trapecios Delanteros', price: 180 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'iluminacion',
                    label: 'Luces y Visibilidad',
                    icon: '🔦',
                    symptoms: [
                        {
                            id: 's_xenon',
                            label: 'Faro Xenon parpadea o se apaga',
                            questions: [{ id: 'q1', text: '¿La luz está rosada?', yes: 'bombilla_xenon', no: 'balastro' }],
                            diagnoses: {
                                'bombilla_xenon': { title: 'Bombilla Xenon Agotada', text: 'Vida útil del gas finalizada.', parts: [{ name: 'Bombilla D1S Osram', price: 80 }] },
                                'balastro': { title: 'Fallo Balastro Electrónico', text: 'El transformador de alta tensión ha fallado.', parts: [{ name: 'Balastro Xenon', price: 120 }] }
                            }
                        },
                        {
                            id: 's_limpia',
                            label: 'Limpia parabrisas no funciona o hace ruido',
                            questions: [{ id: 'q1', text: '¿Huele a quemado?', yes: 'motor_limpia', no: 'varillaje_atascado' }],
                            diagnoses: {
                                'motor_limpia': { title: 'Quemado de Motor Limpia', text: 'Fallo eléctrico interno por sobreesfuerzo.', parts: [{ name: 'Motor Limpiaparabrisas', price: 70 }] },
                                'varillaje_atascado': { title: 'Mecanismo de Limpia Bloqueado', text: 'Oxido en las rótulas del varillaje.', parts: [{ name: 'Varillaje Limpia', price: 45 }, { name: 'Escobillas Aerotwin', price: 30 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'confort_body',
                    label: 'Cuerpo y Confort',
                    icon: '🏢',
                    symptoms: [
                        {
                            id: 's_ventanilla',
                            label: 'Ventanilla no sube (se oye motor)',
                            questions: [{ id: 'q1', text: '¿Cristal caído al fondo?', yes: 'elevalunas_roto', no: 'pulsador' }],
                            diagnoses: {
                                'elevalunas_roto': { title: 'Rotura de Mecanismo Elevalunas', text: 'Cables de acero trenzado cortados.', parts: [{ name: 'Elevalunas con Motor', price: 95 }] },
                                'pulsador': { title: 'Fallo Interruptor de Ventanilla', text: 'Contactos internos sucios o quemados.', parts: [{ name: 'Botonera Principal', price: 35 }] }
                            }
                        },
                        {
                            id: 's_climatizador',
                            label: 'Sale aire frío por un lado y caliente por otro',
                            questions: [{ id: 'q1', text: '¿Se oyen "clics" tras el salpicadero?', yes: 'servomotor', no: 'compuerta_atascada' }],
                            diagnoses: {
                                'servomotor': { title: 'Fallo Servomotor de Mezcla', text: 'El motor eléctrico de la trampilla no mueve.', parts: [{ name: 'Servomotor Climatizador', price: 60 }] },
                                'compuerta_atascada': { title: 'Compuerta Obstruida', text: 'Bloqueo mecánico del flujo de aire.', parts: [{ name: 'Filtro Habitáculo Polen', price: 15 }] }
                            }
                        }
                    ]
                },
                {
                    id: 'transmision_pro',
                    label: 'Transmisión Pro',
                    icon: '⚙️',
                    symptoms: [
                        {
                            id: 's_dsg',
                            label: 'Tirones en cambio automático (DSG/ZF)',
                            questions: [{ id: 'q1', text: '¿Parpadea la letra P/R/D?', yes: 'mechatronica', no: 'mantenimiento_caja' }],
                            diagnoses: {
                                'mechatronica': { title: 'Fallo Unidad Mecatrónica', text: 'Fallo en el cerebro electro-hidráulico del cambio.', parts: [{ name: 'Unidad Mecatrónica Reac.', price: 650 }] },
                                'mantenimiento_caja': { title: 'Aceite de Caja Agotado/Sucio', text: 'Necesita mantenimiento inmediato para evitar daños.', parts: [{ name: 'Kit Aceite y Filtro Caja', price: 180 }] }
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
