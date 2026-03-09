export const bateria_carga_symptoms = [
    // 2 existing original symptoms
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
    },
    // 20 new symptoms
    {
        id: 's_12v_muerta', label: 'El coche no enciende ni abre (Fallo 12V)', questions: [{ id: 'q1', text: '¿Las luces interiores parpadean?', yes: 'bat_12v_ko', no: 'fusible_principal' }],
        diagnoses: { bat_12v_ko: { title: 'Batería Auxiliar 12V Agotada', text: 'La batería de 12V ha muerto y no puede iniciar el sistema HV.', parts: [{ name: 'Batería 12V AGM 60Ah', price: 150 }] }, fusible_principal: { title: 'Fusible DCDC Fundido', text: 'No hay paso de corriente del sistema de alta al de baja.', parts: [{ name: 'Fusible DCDC 150A', price: 20 }] } }
    },
    {
        id: 's_calor_carga', label: 'Exceso de calor al cargar', questions: [{ id: 'q1', text: '¿El conector quema al tacto?', yes: 'pines_quemados', no: 'ref_cargador_ko' }],
        diagnoses: { pines_quemados: { title: 'Pines AC Dañados', text: 'Resistencia alta en los pines de carga.', parts: [{ name: 'Receptáculo Carga AC', price: 210 }] }, ref_cargador_ko: { title: 'Fallo Refrigeración OBC', text: 'La bomba de agua del cargador a bordo no gira.', parts: [{ name: 'Bomba Circulación OBC', price: 180 }] } }
    },
    {
        id: 's_carga_lenta', label: 'Carga en DC excesivamente lenta', questions: [{ id: 'q1', text: '¿La batería estaba muy fría?', yes: 'coldgate', no: 'contactor_dc' }],
        diagnoses: { coldgate: { title: 'Batería Fría (Coldgate)', text: 'Velocidad limitada para proteger celdas. No es avería grave.', parts: [{ name: 'Calentador PTC Batería', price: 450 }] }, contactor_dc: { title: 'Fallo Contactor DC', text: 'Un contactor no cierra bien, limitando el paso de corriente.', parts: [{ name: 'Contactor DC HV', price: 320 }] } }
    },
    {
        id: 's_cable_bloqueado', label: 'El cable de carga no se puede desconectar', questions: [{ id: 'q1', text: '¿Se oye el motor de bloqueo intenter soltar?', yes: 'actuador_atascado', no: 'bms_bloqueo' }],
        diagnoses: { actuador_atascado: { title: 'Actuador de Bloqueo Atascado', text: 'El pin de bloqueo físico está averiado.', parts: [{ name: 'Actuador Puerto Carga', price: 80 }] }, bms_bloqueo: { title: 'Carga No Finalizada (BMS)', text: 'El coche cree que sigue pasando voltaje.', parts: [{ name: 'Reset Software BMS', price: 60 }] } }
    },
    {
        id: 's_error_aislamiento', label: 'Mensaje "Error Sistema Eléctrico" y no entra "Ready"', questions: [{ id: 'q1', text: '¿Ha llovido recientemente?', yes: 'fuga_hv_agua', no: 'compresor_derivado' }],
        diagnoses: { fuga_hv_agua: { title: 'Humedad en Conector HV', text: 'Entrada de agua en el cableado de alta tensión.', parts: [{ name: 'Sello Conector HV', price: 35 }] }, compresor_derivado: { title: 'Derivación Compresor AC', text: 'El compresor del aire acondicionado tiene fuga a masa.', parts: [{ name: 'Compresor AC HV', price: 850 }] } }
    },
    {
        id: 's_tortuga', label: 'Modo Tortuga activo sin estar descargado', questions: [{ id: 'q1', text: '¿Al acelerar da tirones?', yes: 'inversor_fase', no: 'sensor_temp_bat' }],
        diagnoses: { inversor_fase: { title: 'Pérdida de Fase Inversor', text: 'Un módulo IGBT del inversor está fallando.', parts: [{ name: 'Inversor Tracción', price: 1500 }] }, sensor_temp_bat: { title: 'Fallo Sensor Temperatura', text: 'El BMS lee temperatura extrema falsa y limita potencia.', parts: [{ name: 'Arnés Sensores NTC BMS', price: 120 }] } }
    },
    {
        id: 's_caida_voltaje', label: 'Al acelerar el porcentaje de batería baja muy rápido', questions: [{ id: 'q1', text: '¿Al soltar el acelerador recupera porcentaje?', yes: 'resistencia_interna', no: 'celda_muerta' }],
        diagnoses: { resistencia_interna: { title: 'Alta Resistencia Interna', text: 'Batería fatigada. Gran caída de voltaje bajo carga.', parts: [{ name: 'Pack Batería Completo', price: 4000 }] }, celda_muerta: { title: 'Celda en Cortocircuito', text: 'Un grupo de celdas no retiene energía.', parts: [{ name: 'Módulo Batería Reemplazo', price: 900 }] } }
    },
    {
        id: 's_bms_offline', label: 'Cuadro en blanco, coche muerto completamente', questions: [{ id: 'q1', text: '¿Revive al darle un biberón a la 12V?', yes: 'dcdc_ko', no: 'fusible_pirotecnico' }],
        diagnoses: { dcdc_ko: { title: 'Convertidor DC/DC Roto', text: 'No recarga la batería de 12V mientras circulas.', parts: [{ name: 'Módulo DCDC', price: 800 }] }, fusible_pirotecnico: { title: 'Fusible Pirotécnico Disparado', text: 'Batería desconectada por seguridad tras un golpe o pico.', parts: [{ name: 'Pyrofuse HV', price: 150 }] } }
    },
    {
        id: 's_ruido_carga', label: 'Ruido muy fuerte de ventilación durante carga AC', questions: [{ id: 'q1', text: '¿Solo ocurre en verano?', yes: 'normal_chiller', no: 'electroventilador_roto' }],
        diagnoses: { normal_chiller: { title: 'Comportamiento Normal (Chiller activo)', text: 'El coche está usando el compresor para enfriar la batería.', parts: [{ name: 'Revision Visual', price: 0 }] }, electroventilador_roto: { title: 'Electroventilador Desequilibrado', text: 'Cojinete de ventilador dañado, genera vibración extrema.', parts: [{ name: 'Electroventilador Frontal', price: 250 }] } }
    },
    {
        id: 's_desbalance', label: 'Carga se corta al 80% siempre', questions: [{ id: 'q1', text: '¿Se arregla dejándolo cargando días a 2kW?', yes: 'top_balance', no: 'software_limit' }],
        diagnoses: { top_balance: { title: 'SOH Limit por Desbalanceo', text: 'El BMS corta la carga porque una celda llegó al tope de voltaje antes que el resto.', parts: [{ name: 'Módulo Batería', price: 700 }] }, software_limit: { title: 'Límite Configurado', text: 'Tienes puesto límite de carga en el menú del coche.', parts: [{ name: 'Configuración Usuario', price: 0 }] } }
    },
    {
        id: 's_chispa_pto', label: 'Chisporroteo al conectar', questions: [{ id: 'q1', text: '¿Huele a ozono o plástico quemado?', yes: 'arco_electrico', no: 'suciedad_puerto' }],
        diagnoses: { arco_electrico: { title: 'Arco Eléctrico en Contactos', text: 'Pines con recubrimiento de plata desgastado.', parts: [{ name: 'Toma Mennekes', price: 190 }] }, suciedad_puerto: { title: 'Puerto Contaminado', text: 'Suciedad en el puerto generando mini-cortos.', parts: [{ name: 'Limpieza Contactos', price: 30 }] } }
    },
    {
        id: 's_corte_suelo', label: 'El diferencial de casa salta al enchufar el coche', questions: [{ id: 'q1', text: '¿Salta instantáneamente al hacer el "clack" del coche?', yes: 'fuga_filtro', no: 'cargador_domestico' }],
        diagnoses: { fuga_filtro: { title: 'Fallo Filtro EMI OBC', text: 'El condensador Y del filtro de entrada deriva corriente a chasis.', parts: [{ name: 'Filtro EMI Cargador', price: 150 }] }, cargador_domestico: { title: 'Diferencial Muy Sensible', text: 'El cuadro de casa necesita un diferencial Tipo A Superinmunizado.', parts: [{ name: 'Diferencial Inmunizado Casa', price: 80 }] } }
    },
    {
        id: 's_vampiro', label: 'Drenaje fantasma alto (Vampire Drain)', questions: [{ id: 'q1', text: '¿Escuchas relés haciendo "clac" con el coche apagado?', yes: 'bms_despierto', no: 'telemetria' }],
        diagnoses: { bms_despierto: { title: 'Unidad de Control No Duerme', text: 'Algún módulo (ej: alarma) impide que el sistema HV duerma.', parts: [{ name: 'Módulo Confort BCM', price: 300 }] }, telemetria: { title: 'Exceso Ping App', text: 'Aplicación de terceros despertando el coche constantemente.', parts: [{ name: 'Desvincular App', price: 0 }] } }
    },
    {
        id: 's_pedal_regenerativo', label: 'Frenada regenerativa no funciona o es débil', questions: [{ id: 'q1', text: '¿La batería está al 100%?', yes: 'regen_limitacion', no: 'freno_inversor' }],
        diagnoses: { regen_limitacion: { title: 'Comportamiento Normal', text: 'Si la batería está llena, no hay donde guardar energía regenerada.', parts: [{ name: 'Uso Normal', price: 0 }] }, freno_inversor: { title: 'Fallo IGBT Regeneración', text: 'Inversor no puede aplicar torque negativo.', parts: [{ name: 'Inversor Reacondicionado', price: 1100 }] } }
    },
    {
        id: 's_bms_code', label: 'Error genérico BMS en pantalla', questions: [{ id: 'q1', text: '¿Te permite seguir circulando?', yes: 'error_menor_bms', no: 'pack_bloqueo' }],
        diagnoses: { error_menor_bms: { title: 'Fallo Comunicación CAN BMS', text: 'Pérdida temporal de paquetes de datos.', parts: [{ name: 'Revisión Cableado CANBus', price: 80 }] }, pack_bloqueo: { title: 'Fallo Monitorización Celdas', text: 'Cable sensor roto dentro del pack.', parts: [{ name: 'Placa Esclava BMS (CSC)', price: 350 }] } }
    },
    {
        id: 's_tapa_bloqueada', label: 'La tapa del puerto de carga no se abre', questions: [{ id: 'q1', text: '¿Hace ruido mecánico al darle a abrir?', yes: 'mecanismo_tapa', no: 'motor_tapa_quemado' }],
        diagnoses: { mecanismo_tapa: { title: 'Engranajes Tapa Rotos', text: 'Dientes de plástico internos pasados.', parts: [{ name: 'Mecanismo Tapa Carga', price: 120 }] }, motor_tapa_quemado: { title: 'Motor de Tapa Roto', text: 'No le llega corriente o el motorcillo está frito.', parts: [{ name: 'Motor Tapa', price: 50 }] } }
    },
    {
        id: 's_regeneracion_bruta', label: 'Regeneración actúa violentamente o a saltos', questions: [{ id: 'q1', text: '¿Pasa en firmes irregulares?', yes: 'abs_interferencia', no: 'resolver_motor' }],
        diagnoses: { abs_interferencia: { title: 'Corte Regeneración por ABS', text: 'Rueda pierde tracción y el ABS corta la regen por seguridad.', parts: [{ name: 'Neumáticos Nuevos', price: 180 }] }, resolver_motor: { title: 'Fallo Sensor Resolver', text: 'El inversor pierde la posición exacta del rotor del motor.', parts: [{ name: 'Sensor Resolver Rotor', price: 210 }] } }
    },
    {
        id: 's_alarma_carga', label: 'Alarma salta al conectar el enchufe', questions: [{ id: 'q1', text: '¿El coche estaba cerrado con llave?', yes: 'robo_cable', no: 'masa_flotante' }],
        diagnoses: { robo_cable: { title: 'Detección Manipulación', text: 'Sistema piensa que alguien intenta robar el cable. Fallo sensor de cierre.', parts: [{ name: 'Bloqueador Puerto Carga', price: 90 }] }, masa_flotante: { title: 'Pico de Tensión Exterior', text: 'El cargador manda ruido eléctrico y dispara la alarma.', parts: [{ name: 'Filtro Red Cargador', price: 65 }] } }
    },
    {
        id: 's_led_rojo', label: 'LED del puerto de carga siempre en rojo fijo', questions: [{ id: 'q1', text: '¿Has pulsado el botón reset del coche?', yes: 'hard_fault_obc', no: 'necesita_reset' }],
        diagnoses: { hard_fault_obc: { title: 'Módulo Control Carga Bloqueado', text: 'Fallo de hardware permanente O-board Charger.', parts: [{ name: 'Placa Control OBC', price: 500 }] }, necesita_reset: { title: 'Fallo de Sesión Colgada', text: 'Protocolo de comunicación con el poste bloqueado.', parts: [{ name: 'Reset Batería 12V', price: 15 }] } }
    },
    {
        id: 's_olor_plastico', label: 'Olor a plástico quemado bajo asientos traseros', questions: [{ id: 'q1', text: '¿Ocurrio en pleno viaje por autopista?', yes: 'conector_bateria_quemado', no: 'cable_12v_solido' }],
        diagnoses: { conector_bateria_quemado: { title: 'Conector de Servicio HV Quemado', text: 'Mal contacto en el Service Disconnect.', parts: [{ name: 'Service Disconnect Plug', price: 150 }] }, cable_12v_solido: { title: 'Cortocircuito Arnés', text: 'Cable rozando bajo el asiento haciendo corto.', parts: [{ name: 'Arnés Interior', price: 120 }] } }
    }
];
