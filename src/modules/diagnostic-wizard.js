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

        // Extended Diagnostic Data Structure (EV Focused & General)
        this.data = [
            {
                id: 'bateria_carga',
                label: 'Batería y Carga (EV)',
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
                            'fallo_puerto': { title: 'Fallo en Puerto de Carga', text: 'El puerto de carga del vehículo detecta un error de conexión o bloqueo.', parts: ['Puerto de Carga', 'Actuador Bloqueo'] },
                            'obc': { title: 'Fallo Cargador de Aboardo (OBC)', text: 'El cargador interno (OBC) no está gestionando la entrada de corriente.', parts: ['Cargador de a Bordo (OBC)', 'Fusible HV'] },
                            'cargador_externo': { title: 'Posible Fallo del Punto de Carga', text: 'El problema parece estar en el cargador externo o cable, no en el coche.', parts: ['Cable de Carga Tipo 2'] }
                        }
                    },
                    {
                        id: 's_carga_lenta',
                        label: 'Carga mucho más lento de lo normal',
                        questions: [
                            { id: 'q1', text: '¿Hace mucho frío en el exterior (< 5°C)?', yes: 'bateria_fria', no: 'q2' },
                            { id: 'q2', text: '¿Estás usando un cable de carga rápida DC?', yes: 'refrigeracion_bat', no: 'cable_limitado' }
                        ],
                        diagnoses: {
                            'bateria_fria': { title: 'Batería Fría', text: 'La batería está demasiado fría para aceptar carga rápida. Es normal.', parts: ['Calentador de Batería'] },
                            'refrigeracion_bat': { title: 'Fallo Refrigeración Batería', text: 'El sistema no enfría la batería durante la carga rápida, limitando la potencia.', parts: ['Bomba de Agua HV', 'Compresor Aire Acondicionado'] },
                            'cable_limitado': { title: 'Cable o Fuente Limitada', text: 'El cable o el enchufe doméstico no permiten más potencia.', parts: ['Cable Tipo 2 Trifásico'] }
                        }
                    },
                    {
                        id: 's_descarga_rapida',
                        label: 'La autonomía baja muy rápido',
                        questions: [
                            { id: 'q1', text: '¿Ocurre principalmente en autopista a alta velocidad?', yes: 'aerodinamica', no: 'q2' },
                            { id: 'q2', text: '¿Ha notado un fallo en el frenado regenerativo?', yes: 'regeneracion', no: 'degradacion' }
                        ],
                        diagnoses: {
                            'aerodinamica': { title: 'Alto Consumo', text: 'El consumo a alta velocidad reduce drásticamente la autonomía.', parts: ['Neumáticos Baja Resistencia', 'Bajos Carena'] },
                            'regeneracion': { title: 'Fallo Regeneración', text: 'No se está recuperando energía al frenar, aumentando el consumo.', parts: ['Inversor', 'Pedal Freno'] },
                            'degradacion': { title: 'Degradación de Batería', text: 'La batería ha perdido capacidad de retención de carga (SOH bajo).', parts: ['Módulo de Batería', 'Batería Completa'] }
                        }
                    },
                    {
                        id: 's_cable_bloqueado',
                        label: 'El cable de carga no se desbloquea',
                        questions: [
                            { id: 'q1', text: '¿Has intentado usar el tirador de emergencia manual?', yes: 'actuador_roto', no: 'probar_manual' }
                        ],
                        diagnoses: {
                            'actuador_roto': { title: 'Actuador de Bloqueo Roto', text: 'El mecanismo solenoide que bloquea el cable ha fallado.', parts: ['Actuador Bloqueo Carga'] },
                            'probar_manual': { title: 'Bloqueo por Software', text: 'Intenta desbloquear desde la pantalla central o el tirador manual.', parts: [] }
                        }
                    },
                    {
                        id: 's_bateria_12v',
                        label: 'Coche "muerto" (No enciende pantallas)',
                        questions: [
                            { id: 'q1', text: '¿Funcionan las luces interiores?', yes: 'sistema_hv', no: 'bat_12v' }
                        ],
                        diagnoses: {
                            'sistema_hv': { title: 'Fallo Contactor HV', text: 'La batería de 12V está bien, pero la batería de tracción no conecta.', parts: ['Contactor HV', 'Piromusible'] },
                            'bat_12v': { title: 'Batería 12V Agotada', text: 'La batería auxiliar de 12V está muerta (fallo muy común en EVs).', parts: ['Batería 12V AGM', 'Batería 12V Litio'] }
                        }
                    },
                    {
                        id: 's_interrupcion',
                        label: 'La carga se corta continuamente',
                        questions: [
                            { id: 'q1', text: '¿El enchufe de pared se calienta?', yes: 'enchufe_mal', no: 'obc_caliente' }
                        ],
                        diagnoses: {
                            'enchufe_mal': { title: 'Instalación Eléctrica Deficiente', text: 'Caída de tensión o sobrecalentamiento en la instalación doméstica.', parts: ['Wallbox'] },
                            'obc_caliente': { title: 'Sobrecalentamiento OBC', text: 'El cargador de a bordo alcanza temperatura crítica y corta.', parts: ['Bomba Refrigeración OBC', 'Cargador de a Bordo'] }
                        }
                    },
                    {
                        id: 's_olor_quemado',
                        label: 'Olor a quemado al cargar',
                        questions: [
                            { id: 'q1', text: '¿El olor viene del puerto de carga?', yes: 'puerto_quemado', no: 'electronica' }
                        ],
                        diagnoses: {
                            'puerto_quemado': { title: 'Puerto de Carga Quemado', text: 'Contactos sulfatados o arco eléctrico en el puerto.', parts: ['Toma de Carga', 'Cableado HV'] },
                            'electronica': { title: 'Fallo Electrónica Potencia', text: 'Componente interno (BMS/Inversor) sobrecalentado.', parts: ['Inversor', 'Caja Fusibles'] }
                        }
                    }
                ]
            },
            {
                id: 'motor_transmision',
                label: 'Motor y Transmisión',
                icon: '⚙️',
                symptoms: [
                    {
                        id: 's_no_ready',
                        label: 'El coche enciende pero no pone "READY"',
                        questions: [
                            { id: 'q1', text: '¿Aparece un triángulo de advertencia rojo?', yes: 'aislamiento', no: 'inversor_logic' }
                        ],
                        diagnoses: {
                            'aislamiento': { title: 'Fallo de Aislamiento HV', text: 'Fuga de corriente en el sistema de alta tensión. El coche se protege.', parts: ['Compresor AA', 'Calentador HV', 'Cableado Naranja'] },
                            'inversor_logic': { title: 'Error Lógico Inversor', text: 'El inversor no recibe señal de arranque o tiene fallo interno.', parts: ['Inversor', 'Unidad Control Motor'] }
                        }
                    },
                    {
                        id: 's_zumbido',
                        label: 'Zumbido agudo al acelerar',
                        questions: [
                            { id: 'q1', text: '¿El ruido cambia con la velocidad?', yes: 'rodamiento_motor', no: 'inversor_ruido' }
                        ],
                        diagnoses: {
                            'rodamiento_motor': { title: 'Rodamiento de Motor/Reductora', text: 'Desgaste mecánico interno en el motor o reductora.', parts: ['Motor Eléctrico', 'Reductora'] },
                            'inversor_ruido': { title: 'Ruido Eléctrico Inversor', text: 'Frecuencia de conmutación audible (coil whine) excesiva.', parts: ['Inversor'] }
                        }
                    },
                    {
                        id: 's_golpe_traccion',
                        label: 'Golpe seco "Cloc" al iniciar marcha',
                        questions: [
                            { id: 'q1', text: '¿Suena en las ruedas?', yes: 'palier', no: 'silentblock' }
                        ],
                        diagnoses: {
                            'palier': { title: 'Holgura en Palier', text: 'Homocinética o palier con desgaste excesivo por el par instantáneo.', parts: ['Palier Izquierdo', 'Palier Derecho'] },
                            'silentblock': { title: 'Soporte Motor Roto', text: 'Los tacos de motor no absorben el par de arranque.', parts: ['Taco Motor', 'Soporte Transmisión'] }
                        }
                    },
                    {
                        id: 's_tortuga',
                        label: 'Modo Tortuga / Potencia Limitada',
                        questions: [
                            { id: 'q1', text: '¿La batería está muy baja (<10%)?', yes: 'bateria_baja', no: 'sobretemp' }
                        ],
                        diagnoses: {
                            'bateria_baja': { title: 'Nivel Crítico Batería', text: 'Protección normal por bajo voltaje de celdas.', parts: [] },
                            'sobretemp': { title: 'Sobretemperatura Sistema', text: 'Motor o Inversor demasiado calientes. Fallo refrigeración.', parts: ['Bomba Agua Eléctrica', 'Radiador'] }
                        }
                    },
                    {
                        id: 's_tirones',
                        label: 'Tirones al mantener velocidad',
                        questions: [
                            { id: 'q1', text: '¿Ocurre a velocidad constante?', yes: 'resolver', no: 'pedal' }
                        ],
                        diagnoses: {
                            'resolver': { title: 'Fallo Sensor Posición Motor (Resolver)', text: 'El inversor pierde la posición exacta del rotor.', parts: ['Sensor Resolver', 'Motor Eléctrico'] },
                            'pedal': { title: 'Fallo Potenciómetro Pedal', text: 'El pedal del acelerador envía señales erráticas.', parts: ['Pedal Acelerador'] }
                        }
                    },
                    {
                        id: 's_vibracion_alta',
                        label: 'Vibración fuerte a alta velocidad',
                        questions: [
                            { id: 'q1', text: '¿Vibra el volante?', yes: 'equilibrado', no: 'palier_desequilibrio' }
                        ],
                        diagnoses: {
                            'equilibrado': { title: 'Ruedas Desequilibradas', text: 'Pérdida de plomos de equilibrado en llantas.', parts: ['Llantas', 'Neumáticos'] },
                            'palier_desequilibrio': { title: 'Palier Desequilibrado', text: 'Palier doblado o con holgura interna.', parts: ['Palier Completo'] }
                        }
                    },
                    {
                        id: 's_liquido',
                        label: 'Mancha de líquido bajo el coche',
                        questions: [
                            { id: 'q1', text: '¿Es líquido aceitoso rojizo/oscuro?', yes: 'valvulina', no: 'refrigerante' }
                        ],
                        diagnoses: {
                            'valvulina': { title: 'Fuga Valvulina Reductora', text: 'Retén de la transmisión/reductora dañado.', parts: ['Retén Reductora', 'Junta Cárter'] },
                            'refrigerante': { title: 'Fuga Refrigerante Batería', text: 'Líquido refrigerante (generalmente azul/rosa) del circuito HV.', parts: ['Manguito Refrigeración', 'Bomba Agua'] }
                        }
                    }
                ]
            },
            {
                id: 'frenos_regen',
                label: 'Frenos y Regeneración',
                icon: '🛑',
                symptoms: [
                    {
                        id: 's_chirrido',
                        label: 'Chirrido al frenar',
                        questions: [
                            { id: 'q1', text: '¿Suena metálico constante?', yes: 'testigo_desgaste', no: 'cristalizacion' }
                        ],
                        diagnoses: {
                            'testigo_desgaste': { title: 'Pastillas Agotadas', text: 'El avisador acústico indica fin de vida útil.', parts: ['Pastillas de Freno', 'Testigo Desgaste'] },
                            'cristalizacion': { title: 'Pastillas Cristalizadas', text: 'Superficie endurecida por poco uso (común en EV si solo se usa regeneración).', parts: ['Pastillas de Freno'] }
                        }
                    },
                    {
                        id: 's_pedal_esponjoso',
                        label: 'Pedal de freno esponjoso',
                        questions: [
                            { id: 'q1', text: '¿El pedal baja hasta el fondo?', yes: 'bomba_freno', no: 'aire_circuito' }
                        ],
                        diagnoses: {
                            'bomba_freno': { title: 'Fallo Bomba Central', text: 'Fuga interna en la bomba de freno o iBooster.', parts: ['Bomba de Freno', 'iBooster'] },
                            'aire_circuito': { title: 'Aire en Líquido de Frenos', text: 'Burbujas en el circuito o líquido muy viejo (higroscópico).', parts: ['Líquido de Frenos Dot4'] }
                        }
                    },
                    {
                        id: 's_vibracion_frenar',
                        label: 'Vibración en volante al frenar',
                        questions: [
                            { id: 'q1', text: '¿Solo vibra al frenar fuerte?', yes: 'discos_alabeados', no: 'holgura_direccion' }
                        ],
                        diagnoses: {
                            'discos_alabeados': { title: 'Discos Alabeados', text: 'Discos deformados por cambios bruscos de temperatura.', parts: ['Discos de Freno'] },
                            'holgura_direccion': { title: 'Holgura en Dirección', text: 'Rótula de dirección con juego, se acentúa al frenar.', parts: ['Rótula Dirección', 'Brazo Suspensión'] }
                        }
                    },
                    {
                        id: 's_no_regen',
                        label: 'El coche no frena/regenera al soltar gas',
                        questions: [
                            { id: 'q1', text: '¿La batería está al 100%?', yes: 'bateria_llena', no: 'fallo_config' }
                        ],
                        diagnoses: {
                            'bateria_llena': { title: 'Regeneración Limitada por Carga', text: 'Si la batería está llena, no puede aceptar energía regenerada. Es normal.', parts: [] },
                            'fallo_config': { title: 'Fallo Sistema Regenerativo', text: 'Error en inversor o configuración de levas de retención.', parts: ['Inversor', 'Levas Volante'] }
                        }
                    },
                    {
                        id: 's_freno_mano',
                        label: 'Freno de mano bloqueado',
                        questions: [
                            { id: 'q1', text: '¿Aparece aviso de avería freno estacionamiento?', yes: 'actuador_epb', no: 'boton_roto' }
                        ],
                        diagnoses: {
                            'actuador_epb': { title: 'Fallo Actuador EPB', text: 'El motor eléctrico de la pinza trasera ha fallado.', parts: ['Pinza Freno Trasera', 'Motor EPB'] },
                            'boton_roto': { title: 'Botón Freno Mano', text: 'Fallo en el interruptor de cabina.', parts: ['Botón Freno Mano'] }
                        }
                    },
                    {
                        id: 's_ruido_clack',
                        label: 'Ruido "Clack" al cambiar dirección marcha (D/R)',
                        questions: [
                            { id: 'q1', text: '¿Suena en las ruedas?', yes: 'pastillas_holgura', no: 'palier' }
                        ],
                        diagnoses: {
                            'pastillas_holgura': { title: 'Holgura Pastillas en Pinza', text: 'Las pastillas se mueven dentro de la pinza al cambiar sentido.', parts: ['Kit Accesorios Pinza', 'Pastillas'] },
                            'palier': { title: 'Holgura Transmisión', text: 'Juego en estriado de palieres.', parts: ['Palier', 'Buje Rueda'] }
                        }
                    },
                    {
                        id: 's_testigo_abs',
                        label: 'Testigo ABS/ESP encendido',
                        questions: [
                            { id: 'q1', text: '¿Funciona el velocímetro?', yes: 'anillo_abs', no: 'sensor_abs' }
                        ],
                        diagnoses: {
                            'sensor_abs': { title: 'Sensor Velocidad Rueda', text: 'Fallo en sensor inductivo de una rueda.', parts: ['Sensor ABS'] },
                            'anillo_abs': { title: 'Anillo Magnético Sucio/Roto', text: 'El anillo del rodamiento está dañado.', parts: ['Rodamiento Rueda', 'Buje'] }
                        }
                    }
                ]
            },
            {
                id: 'clima',
                label: 'Climatización (HVAC)',
                icon: '❄️',
                symptoms: [
                    {
                        id: 's_no_enfria',
                        label: 'Aire acondicionado no enfría',
                        questions: [
                            { id: 'q1', text: '¿Se oye el compresor funcionar?', yes: 'falta_gas', no: 'fallo_compresor' }
                        ],
                        diagnoses: {
                            'falta_gas': { title: 'Fuga de Gas Refrigerante', text: 'Circuito vacío o con baja presión.', parts: ['Condensador', 'Tubería AC'] },
                            'fallo_compresor': { title: 'Fallo Compresor Eléctrico', text: 'El compresor de AA de alto voltaje no arranca.', parts: ['Compresor AA Eléctrico'] }
                        }
                    },
                    {
                        id: 's_no_calienta',
                        label: 'Calefacción no calienta',
                        questions: [
                            { id: 'q1', text: '¿Tu coche tiene bomba de calor?', yes: 'valvula_inversora', no: 'ptc' }
                        ],
                        diagnoses: {
                            'valvula_inversora': { title: 'Válvula Inversora Atascada', text: 'Fallo en gestión de bomba de calor.', parts: ['Válvula Expansión', 'Octovalve (Tesla)'] },
                            'ptc': { title: 'Calentador PTC Fundido', text: 'La resistencia eléctrica de calefacción ha fallado.', parts: ['Calentador PTC', 'Resistencia Calefacción'] }
                        }
                    },
                    {
                        id: 's_ruido_vent',
                        label: 'Ruido/Vibración al poner ventilador',
                        questions: [
                            { id: 'q1', text: '¿Aumenta con la velocidad del aire?', yes: 'hojas_motor', no: 'trampilla' }
                        ],
                        diagnoses: {
                            'hojas_motor': { title: 'Objeto en Ventilador', text: 'Hojas o suciedad desequilibran el ventilador habitáculo.', parts: ['Filtro Habitáculo', 'Ventilador Interior'] },
                            'trampilla': { title: 'Motor Trampilla Roto', text: 'Ruido de "clac-clac" de un servomotor de mezcla.', parts: ['Servomotor Trampilla'] }
                        }
                    },
                    {
                        id: 's_olor',
                        label: 'Mal olor al poner el aire',
                        questions: [
                            { id: 'q1', text: '¿Huele a humedad/vinagre?', yes: 'hongos', no: 'quemado' }
                        ],
                        diagnoses: {
                            'hongos': { title: 'Evaporador Sucio', text: 'Crecimiento de bacterias en el evaporador.', parts: ['Filtro Habitáculo Carbón', 'Spray Limpieza'] },
                            'quemado': { title: 'Resistencia Sobrecalentada', text: 'Polvo quemándose en resistencia calefacción.', parts: ['Resistencia Ventilador'] }
                        }
                    },
                    {
                        id: 's_empanado',
                        label: 'Cristales se empañan continuamente',
                        questions: [
                            { id: 'q1', text: '¿Está activada la recirculación?', yes: 'quitar_recirc', no: 'trampilla_atascada' }
                        ],
                        diagnoses: {
                            'quitar_recirc': { title: 'Recirculación Activada', text: 'El aire viciado húmedo no sale del coche. Desactívala.', parts: [] },
                            'trampilla_atascada': { title: 'Trampilla Recirculación Rota', text: 'La trampilla de entrada de aire exterior está cerrada permanentemente.', parts: ['Servomotor Recirculación'] }
                        }
                    },
                    {
                        id: 's_charco_interior',
                        label: 'Agua en el suelo del copiloto',
                        questions: [
                            { id: 'q1', text: '¿Ocurre tras usar el aire acondicionado?', yes: 'desague', no: 'filtracion' }
                        ],
                        diagnoses: {
                            'desague': { title: 'Desagüe Condensación Obstruido', text: 'El tubo de salida de agua del evaporador está taponado.', parts: ['Tubo Desagüe'] },
                            'filtracion': { title: 'Entrada Agua Exterior', text: 'Filtración por goma de puerta o parabrisas.', parts: ['Goma Puerta', 'Vierteaguas'] }
                        }
                    },
                    {
                        id: 's_ruido_compresor',
                        label: 'Ruido excesivo desde el morro (Cargando o AC)',
                        questions: [
                            { id: 'q1', text: '¿Suena como una aspiradora fuerte?', yes: 'ventilador_rad', no: 'compresor' }
                        ],
                        diagnoses: {
                            'ventilador_rad': { title: 'Ventilador Radiador a Máxima', text: 'Sistema refrigeración trabajando al máximo (posible suciedad radiadores).', parts: ['Ventilador Radiador'] },
                            'compresor': { title: 'Compresor AC Ruidoso', text: 'Desgaste interno en el compresor.', parts: ['Compresor AA', 'Soportes Compresor'] }
                        }
                    }
                ]
            },
            {
                id: 'suspension',
                label: 'Suspensión y Dirección',
                icon: '🔩',
                symptoms: [
                    {
                        id: 's_golpe_bache',
                        label: 'Golpe seco al pasar baches',
                        questions: [
                            { id: 'q1', text: '¿Suena metálico "clonck"?', yes: 'bieleta', no: 'copela' }
                        ],
                        diagnoses: {
                            'bieleta': { title: 'Bieleta Barra Estabilizadora', text: 'Holgura en las rótulas de la bieleta (muy común).', parts: ['Bieleta Estabilizadora'] },
                            'copela': { title: 'Copela Amortiguador', text: 'Juego en el soporte superior del amortiguador.', parts: ['Copela Suspensión', 'Rodamiento Copela'] }
                        }
                    },
                    {
                        id: 's_chirrido_bache',
                        label: 'Ruido a "Cama Vieja" en baches',
                        questions: [
                            { id: 'q1', text: '¿Suena más en frío?', yes: 'silentblock_barra', no: 'trapecio' }
                        ],
                        diagnoses: {
                            'silentblock_barra': { title: 'Gomas Barra Estabilizadora', text: 'Los casquillos de goma están resecos y chirrían.', parts: ['Goma Barra Estabilizadora'] },
                            'trapecio': { title: 'Silentblocks Trapecio', text: 'Gomas de los brazos de suspensión agrietadas.', parts: ['Brazo Suspensión', 'Silentblock'] }
                        }
                    },
                    {
                        id: 's_direccion_dura',
                        label: 'Dirección dura o a tirones',
                        questions: [
                            { id: 'q1', text: '¿El volante no vuelve al centro?', yes: 'cremallera', no: 'motor_epas' }
                        ],
                        diagnoses: {
                            'cremallera': { title: 'Cremallera Dirección Atascada', text: 'Fallo mecánico en engranaje o falta de grasa.', parts: ['Cremallera Dirección'] },
                            'motor_epas': { title: 'Fallo Motor Dirección Asistida', text: 'El motor eléctrico de asistencia está fallando.', parts: ['Columna Dirección Eléctrica'] }
                        }
                    },
                    {
                        id: 's_desvio',
                        label: 'El coche se va hacia un lado',
                        questions: [
                            { id: 'q1', text: '¿Has revisado la presión de neumáticos?', yes: 'alineacion', no: 'presion' }
                        ],
                        diagnoses: {
                            'alineacion': { title: 'Mala Alineación', text: 'La geometría de dirección (paralelo) está mal.', parts: ['Servicio Alineación'] },
                            'presion': { title: 'Presión Incorrecta', text: 'Una rueda está más baja que la contraria.', parts: ['Sensor TPMS'] }
                        }
                    },
                    {
                        id: 's_desgaste_ruedas',
                        label: 'Desgaste irregular de neumáticos',
                        questions: [
                            { id: 'q1', text: '¿Desgaste solo por el interior?', yes: 'caida_neg', no: 'convergencia' }
                        ],
                        diagnoses: {
                            'caida_neg': { title: 'Exceso Caída Negativa', text: 'Brazos de suspensión cedidos o mal ajustados.', parts: ['Brazo Suspensión', 'Tirante'] },
                            'convergencia': { title: 'Convergencia Incorrecta', text: 'Ajuste de dirección necesario.', parts: ['Rótula Dirección'] }
                        }
                    },
                    {
                        id: 's_vibracion_volante',
                        label: 'Vibración volante a 100-120 km/h',
                        questions: [
                            { id: 'q1', text: '¿Vibra también el asiento?', yes: 'traseras', no: 'delanteras' }
                        ],
                        diagnoses: {
                            'delanteras': { title: 'Desequilibrado Ruedas Delanteras', text: 'Falta equilibrar neumáticos delanteros.', parts: ['Neumático', 'Llanta'] },
                            'traseras': { title: 'Desequilibrado Ruedas Traseras', text: 'Vibración en chasis/asiento indica eje trasero.', parts: ['Neumático', 'Llanta'] }
                        }
                    },
                    {
                        id: 's_crujido_giro',
                        label: 'Crujido al girar volante en parado',
                        questions: [
                            { id: 'q1', text: '¿Suena "clac-clac" continuo?', yes: 'homocinetica', no: 'copela_agarrotada' }
                        ],
                        diagnoses: {
                            'homocinetica': { title: 'Junta Homocinética', text: 'Guardapolvos roto y junta dañada.', parts: ['Junta Homocinética', 'Guardapolvos'] },
                            'copela_agarrotada': { title: 'Rodamiento de Copela', text: 'El muelle salta porque el rodamiento superior no gira.', parts: ['Kit Copela Amortiguador'] }
                        }
                    }
                ]
            },
            {
                id: 'electricidad',
                label: 'Electricidad y Confort',
                icon: '💡',
                symptoms: [
                    {
                        id: 's_ventanilla',
                        label: 'Ventanilla no sube/baja',
                        questions: [
                            { id: 'q1', text: '¿Se oye el motor sonar?', yes: 'mecanismo', no: 'motor_elevalunas' }
                        ],
                        diagnoses: {
                            'mecanismo': { title: 'Cables Mecanismo Rotos', text: 'El cable de acero del elevalunas se ha partido.', parts: ['Mecanismo Elevalunas'] },
                            'motor_elevalunas': { title: 'Motor Elevalunas Quemado', text: 'Fallo eléctrico del motor o botonera.', parts: ['Motor Elevalunas', 'Botonera Principal'] }
                        }
                    },
                    {
                        id: 's_cierre',
                        label: 'Cierre centralizado falla',
                        questions: [
                            { id: 'q1', text: '¿Falla solo una puerta?', yes: 'cerradura', no: 'mando' }
                        ],
                        diagnoses: {
                            'cerradura': { title: 'Cerradura Eléctrica Averiada', text: 'El motor interno de la cerradura no actúa.', parts: ['Cerradura Puerta'] },
                            'mando': { title: 'Pila de Mando / Receptor', text: 'Pila agotada o fallo en módulo confort.', parts: ['Pila CR2032', 'Módulo Confort'] }
                        }
                    },
                    {
                        id: 's_limpia',
                        label: 'Limpiaparabrisas no funcionan',
                        questions: [
                            { id: 'q1', text: '¿Se oye el motor pero no mueven?', yes: 'varillaje', no: 'fusible_motor' }
                        ],
                        diagnoses: {
                            'varillaje': { title: 'Varillaje Suelto/Roto', text: 'Las varillas de transmisión se han soltado.', parts: ['Varillaje Limpiaparabrisas'] },
                            'fusible_motor': { title: 'Fusible o Motor Quemado', text: 'Comprobar fusibles primero, luego motor.', parts: ['Motor Limpiaparabrisas', 'Fusibles'] }
                        }
                    },
                    {
                        id: 's_maletero',
                        label: 'Maletero eléctrico no abre/cierra',
                        questions: [
                            { id: 'q1', text: '¿Hace ruido pero no sube?', yes: 'amortiguador', no: 'cerradura_maletero' }
                        ],
                        diagnoses: {
                            'amortiguador': { title: 'Amortiguadores/Husillos Fallidos', text: 'Los motores de elevación (struts) han perdido fuerza.', parts: ['Amortiguador Portón Eléctrico'] },
                            'cerradura_maletero': { title: 'Cerradura Atascada', text: 'El pestillo no libera la puerta.', parts: ['Cerradura Maletero'] }
                        }
                    },
                    {
                        id: 's_pantalla',
                        label: 'Pantalla táctil negra/congelada',
                        questions: [
                            { id: 'q1', text: '¿Suena la música o intermitentes?', yes: 'pantalla_lcd', no: 'mcu' }
                        ],
                        diagnoses: {
                            'pantalla_lcd': { title: 'Fallo Panel LCD', text: 'La unidad procesa pero la pantalla no muestra imagen.', parts: ['Pantalla Central'] },
                            'mcu': { title: 'Fallo Unidad Multimedia (MCU)', text: 'El ordenador de infoentretenimiento ha fallado (eMMC/Chip).', parts: ['Unidad MCU'] }
                        }
                    },
                    {
                        id: 's_luces_freno',
                        label: 'Luces de freno fijas o no van',
                        questions: [
                            { id: 'q1', text: '¿Son todas las luces?', yes: 'conmutador', no: 'bombilla_led' }
                        ],
                        diagnoses: {
                            'conmutador': { title: 'Interruptor Pedal Freno', text: 'El sensor del pedal se ha quedado pegado o roto.', parts: ['Interruptor Freno'] },
                            'bombilla_led': { title: 'Fallo Piloto', text: 'Bombilla fundida o fallo placa LED del piloto.', parts: ['Piloto Trasero'] }
                        }
                    },
                    {
                        id: 's_espejo',
                        label: 'Espejo no se pliega',
                        questions: [
                            { id: 'q1', text: '¿Se oye el motor girar?', yes: 'engranaje', no: 'motor_espejo' }
                        ],
                        diagnoses: {
                            'engranaje': { title: 'Engranaje Espejo Roto', text: 'Mecanismo interno de plástico partido por golpe.', parts: ['Espejo Completo', 'Kit Reparación Espejo'] },
                            'motor_espejo': { title: 'Motor Abatimiento Quemado', text: 'El motor eléctrico del espejo ha muerto.', parts: ['Espejo Retrovisor'] }
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
                <h3>Selecciona el síntoma principal (Total: ${this.selections.category.symptoms.length}):</h3>
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

        if (!question) {
            // Fallback logic
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
                this.renderResult(this.selections.symptom.diagnoses[Object.keys(this.selections.symptom.diagnoses)[0]]);
            }
        });

        this.container.querySelector('.no').addEventListener('click', () => {
            if (question.no && this.selections.symptom.diagnoses[question.no]) {
                this.renderResult(this.selections.symptom.diagnoses[question.no]);
            } else if (this.selections.symptom.questions[index + 1]) {
                this.renderQuestion(index + 1);
            } else {
                // Try to get the second diagnosis key if available, else first
                const keys = Object.keys(this.selections.symptom.diagnoses);
                this.renderResult(this.selections.symptom.diagnoses[keys[1] || keys[0]]);
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
            const searchTerm = diagnosis.parts[0];
            const searchInput = document.getElementById('main-search-input');
            if (searchInput) {
                searchInput.value = searchTerm;
                document.dispatchEvent(new CustomEvent('search-query', { detail: searchTerm }));

                window.location.hash = '#/';
                setTimeout(() => {
                    const target = document.getElementById('product-list-container');
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        });
    }
}
