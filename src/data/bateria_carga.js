export const bateria_carga_symptoms = [
    // 2 existing original symptoms
    {
        id: 's_no_carga',
        label: 'El coche no carga al enchufarlo (Mennekes / CCS2)',
        questions: [
            { id: 'q1', text: '¿El puerto de carga parpadea en rojo o da error en el cuadro?', yes: 'fallo_puerto', no: 'q2' },
            { id: 'q2', text: '¿Has probado en otro poste o cargador diferente y sigue fallando?', yes: 'obc', no: 'cargador_externo' }
        ],
        diagnoses: {
            'fallo_puerto': { title: 'Fallo en Puerto de Carga (DTC B1234)', text: 'El puerto de carga detecta error de hardware, humedad o exceso de temperatura en los pines.', parts: [{ name: 'Puerto de Carga CCS2', price: 250 }, { name: 'Actuador Bloqueo', price: 45 }] },
            'obc': { title: 'Fallo Cargador a Bordo (OBC)', text: 'El inversor interno AC/DC ha sufrido una sobretensión y no convierte la corriente alterna de la calle.', parts: [{ name: 'Cargador a Bordo (OBC) 11kW', price: 1200 }, { name: 'Fusible Alta Tensión HV', price: 15 }] },
            'cargador_externo': { title: 'Error de Infraestructura Exterior', text: 'El problema está en el Wallbox o el cable, el coche está perfecto.', parts: [{ name: 'Cable Tipo 2 Mennekes 32A', price: 180 }] }
        }
    },
    {
        id: 's_autonomia',
        label: 'Pérdida rápida y súbita de autonomía (Caída de % de batería)',
        questions: [{ id: 'q1', text: '¿Ocurre solo cuando pisas a fondo (gran demanda de energía)?', yes: 'celda_desequilibrada', no: 'soh_bajo' }],
        diagnoses: {
            'celda_desequilibrada': { title: 'Desequilibrio / Celda Débil (BMS Error)', text: 'Alguna celda o bloque paralelo tiene mucha resistencia interna y su voltaje se desploma al pedir potencia.', parts: [{ name: 'Módulo Batería Reacondicionado', price: 800 }, { name: 'Reprogramación BMS', price: 150 }] },
            'soh_bajo': { title: 'Degradación Química Severa (SOH < 70%)', text: 'La batería ha perdido su capacidad original por calor o ciclos repetidos de carga rápida.', parts: [{ name: 'Pack Batería de Intercambio', price: 4500 }] }
        }
    },
    // 18 New Real Unique Symptoms
    {
        id: 's_12v_muerta', label: 'El coche está completamente muerto, no abren ni las puertas', questions: [{ id: 'q1', text: '¿Al darle corriente con pinzas bajo el capó revive y encienden las pantallas?', yes: 'bat_12v_ko', no: 'fusible_pirotecnico' }],
        diagnoses: { bat_12v_ko: { title: 'Batería Auxiliar 12V Agotada', text: 'Los eléctricos usan una batería de plomo para el ordenador central. Si muere, el contactor de Alta Tensión no cierra.', parts: [{ name: 'Batería 12V AGM 60Ah Especial EV', price: 150 }] }, fusible_pirotecnico: { title: 'Fusible Pirotécnico Disparado / DCDC', text: 'El fusible de seguridad de Alta Tensión ha detonado por un impacto, o el módulo DCDC está roto.', parts: [{ name: 'Pyrofuse HV', price: 180 }, { name: 'Conversor DC/DC', price: 900 }] } }
    },
    {
        id: 's_calor_carga', label: 'El cable de carga se calienta muchísimo (Riesgo de incendio)', questions: [{ id: 'q1', text: '¿Huele a plástico quemado cerca del puerto del coche?', yes: 'pines_quemados', no: 'enchufe_schuko' }],
        diagnoses: { pines_quemados: { title: 'Pines AC Dañados/Fogueados', text: 'Resistencia muy alta en los pines por desgaste o suciedad provocando efecto Joule.', parts: [{ name: 'Receptáculo Carga AC (Harness)', price: 210 }] }, enchufe_schuko: { title: 'Enchufe Doméstico Derretido', text: 'Estás cargando a demasiados amperios (ej. 13A o 16A) en un enchufe normal de casa sin línea dedicada.', parts: [{ name: 'Base Enchufe Reforzada GreenUp', price: 60 }] } }
    },
    {
        id: 's_carga_lenta', label: 'La recarga Rápida (DC) va lentísima (ej: a 20kW en lugar de 100kW)', questions: [{ id: 'q1', text: '¿La batería estaba muy fría (invierno) o acabas de iniciar la marcha?', yes: 'coldgate', no: 'bomba_refrigeracion' }],
        diagnoses: { coldgate: { title: 'Batería Fría (Coldgate)', text: 'El BMS limita la entrada de corriente para no destruir los ánodos con depósitos de litio metálico.', parts: [{ name: 'Comportamiento Normal (Conducir más o preacondicionar)', price: 0 }] }, bomba_refrigeracion: { title: 'Bomba de Refrigeración de Batería Rota', text: 'El líquido no circula, por lo que el coche no puede disipar el calor de la carga y reduce la velocidad (Thermal Throttling).', parts: [{ name: 'Bomba Circulación Chiller HV', price: 320 }] } }
    },
    {
        id: 's_cable_bloqueado', label: 'No puedo sacar el cable de carga (Tirón de emergencia no funciona)', questions: [{ id: 'q1', text: '¿Se oye un "clack clack" repetitivo cuando intentas abrir con el mando?', yes: 'actuador_atascado', no: 'bms_bloqueo' }],
        diagnoses: { actuador_atascado: { title: 'Actuador de Bloqueo Mecánico Roto', text: 'El pinćhazo de plástico que atrapa el cable se ha partido o el micromotor se ha quemado.', parts: [{ name: 'Actuador Cierre Puerto Carga', price: 85 }] }, bms_bloqueo: { title: 'Software Colgado (Carga "Fantasma")', text: 'El coche sigue comunicándose con el poste por la línea CP y no libera el contactor.', parts: [{ name: 'Reset 12V / Borrado Averías', price: 40 }] } }
    },
    {
        id: 's_error_aislamiento', label: 'Mensaje STOP: "Avería Sistema Eléctrico de Alta Tensión"', questions: [{ id: 'q1', text: '¿Has encendido el aire acondicionado o calefacción justo antes de que saltara?', yes: 'compresor_derivado', no: 'fuga_hv_agua' }],
        diagnoses: { compresor_derivado: { title: 'Derivación Compresor AC HV', text: 'El bobinado del compresor del aire acondicionado (que funciona a 400V) tiene una fuga a masa.', parts: [{ name: 'Compresor AC Alta Tensión', price: 850 }] }, fuga_hv_agua: { title: 'Fallo de Aislamiento General (Humedad)', text: 'Agua ha entrado en la batería, enectores naranja o mangueras provocando cortocircuito a chasis.', parts: [{ name: 'Sello Conector HV Central', price: 135 }] } }
    },
    {
        id: 's_tortuga', label: 'Aparece una Tortuga 🐢 amarilla en el cuadro de mandos', questions: [{ id: 'q1', text: '¿El porcentaje de batería es superior al 15%?', yes: 'sensor_temp_bat', no: 'normal_descargado' }],
        diagnoses: { sensor_temp_bat: { title: 'Limp Mode por Temperatura BMS', text: 'Temperatura crítica detectada (por calor excesivo o fallo de sensor NTC interno). Limita potencia del motor.', parts: [{ name: 'Arnés Sensores Temperatura BMS', price: 160 }] }, normal_descargado: { title: 'Modo Tortuga Normal', text: 'Voltaje total muy bajo. Simplemente carga el coche de inmediato para no dañar las celdas.', parts: [{ name: 'Recarga Inmediata', price: 0 }] } }
    },
    {
        id: 's_ruido_carga', label: 'El coche hace un ruido espantoso de ventilador o compresor al cargar y vibra', questions: [{ id: 'q1', text: '¿Cesa el ruido si apagas el aire acondicionado del coche mientras cargas?', yes: 'normal_chiller', no: 'electroventilador_roto' }],
        diagnoses: { normal_chiller: { title: 'Comportamiento Normal (Refrigeración Activa)', text: 'En cargas rápidas en verano, el compresor de A/C se pone a máximas RPM para enfriar la batería.', parts: [{ name: 'Ninguna (Monitor de Temperaturas Opcional)', price: 0 }] }, electroventilador_roto: { title: 'Electroventilador Desequilibrado / Rodamiento', text: 'El aspa ha perdido el contrapeso o el rodamiento del electro del radiador está destruido.', parts: [{ name: 'Conjunto Electroventilador Frontal', price: 250 }] } }
    },
    {
        id: 's_vampiro', label: 'El coche pierde entre un 3% y un 5% de batería cada noche aparcado (Vampire Drain)', questions: [{ id: 'q1', text: '¿Usas aplicaciones de terceros en el móvil como Tronity o TeslaFi?', yes: 'telemetria', no: 'bms_despierto' }],
        diagnoses: { telemetria: { title: 'Despertador por API (Ping Constante)', text: 'La app consulta los datos cada pocos minutos impidiendo que el contactor principal "duerma".', parts: [{ name: 'Cambio Contraseñas API', price: 0 }] }, bms_despierto: { title: 'Módulo Confort BCM / Alarma en bucle', text: 'Alguna centralita no se suspende, drenando la 12V e forzando a la batería de tracción a recargarla.', parts: [{ name: 'Actualización Software Gateway', price: 90 }] } }
    },
    {
        id: 's_pedal_regenerativo', label: 'Al soltar el acelerador el coche no frena nada (Regeneración CERO)', questions: [{ id: 'q1', text: '¿La batería está completamente cargada al 100%?', yes: 'regen_limitacion', no: 'inversor_fase' }],
        diagnoses: { regen_limitacion: { title: 'Protección de Sobrecarga (Normal)', text: 'Si la batería está al 100%, no puede almacenar la energía cinética de la frenada, por lo que el motor rueda libre.', parts: [{ name: 'Uso de Freno Mecánico (Normal)', price: 0 }] }, inversor_fase: { title: 'Fallo Puente IGBT del Inversor', text: 'El módulo inversor ha perdido capacidad de inyectar corriente en sentido inverso.', parts: [{ name: 'Inversor Tracción Completo', price: 1600 }] } }
    },
    {
        id: 's_bms_code', label: 'Error "Defecto Gestión Batería" en pantalla, no sube de 50km/h', questions: [{ id: 'q1', text: '¿Aparece intermitentemente en baches fuertes?', yes: 'error_menor_bms', no: 'pack_bloqueo' }],
        diagnoses: { error_menor_bms: { title: 'Fallo Arnés Comunicación CAN Bus', text: 'Un conector del bus CAN a la batería está flojo o rozado, perdiendo paquetes de datos ocasionalmente.', parts: [{ name: 'Reparación Mazo Cables HV CAN', price: 120 }] }, pack_bloqueo: { title: 'Placa Esclava BMS Defectuosa', text: 'Un circuito CSC (Cell Supervising Circuit) dentro del pack se ha quemado y no lee el voltaje de sus celdas.', parts: [{ name: 'Módulo Placa BMS Esclava', price: 350 }] } }
    },
    {
        id: 's_corte_suelo', label: 'Al enchufar el cargador, salta la luz (Diferencial) de toda la casa', questions: [{ id: 'q1', text: '¿Salta en el mismo instante en el que el coche hace el "clack" interno?', yes: 'fuga_filtro', no: 'cargador_domestico' }],
        diagnoses: { fuga_filtro: { title: 'Filtro EMI Cargador Cortocircuitado', text: 'Los condensadores "Y" de la entrada AC del coche están derivando a masa (chasis) más de 30mA.', parts: [{ name: 'Filtro EMI Interno OBC', price: 185 }] }, cargador_domestico: { title: 'Armónicos en Hogar (Fallo Diferencial AC)', text: 'El diferencial de casa es Tipo AC (obsoleto). Los VEs inyectan ruido DC y lo hacen disparar.', parts: [{ name: 'Instalación Diferencial Superinmunizado Tipo A', price: 95 }] } }
    },
    {
        id: 's_chispa_pto', label: 'Chisporroteo y ruido eléctrico metálico al mover el enchufe', questions: [{ id: 'q1', text: '¿Los pines gordos del puerto del coche se ven oscurecidos y no plateados?', yes: 'arco_electrico', no: 'cable_roto' }],
        diagnoses: { arco_electrico: { title: 'Micro-arcos eléctricos por Desgaste', text: 'El baño de plata de los pines AC ha desaparecido, provocando falsos contactos de 32 Amperios (Riesgo).', parts: [{ name: 'Toma Hembra Mennekes Coche', price: 210 }] }, cable_roto: { title: 'Conector de Manguera Defectuoso', text: 'Los muelles de tensión dentro del enchufe tuyo de la pared están cedidos.', parts: [{ name: 'Conector Macho Cable Carga', price: 50 }] } }
    },
    {
        id: 's_desbalance', label: 'La recarga siempre se detiene al 82% (o similar) y dice batería llena', questions: [{ id: 'q1', text: '¿Te has asegurado de que no tienes configurado el límite de carga en el Menú?', yes: 'top_balance', no: 'software_limit' }],
        diagnoses: { top_balance: { title: 'Límite Impuesto por Desbalanceo BMS', text: 'Una celda débil ha llegado a su voltaje máximo (ej. 4.2V) mucho antes que el resto. El BMS corta por seguridad para no incendiar esa celda.', parts: [{ name: 'Sustitución Grupo Celdas Fallido', price: 900 }, { name: 'Equilibrado Manual Taller', price: 250 }] }, software_limit: { title: 'Límite de Batería Configurado por Usuario', text: 'Tienes puesto que solo cargue al 80% para trayectos diarios para cuidar la batería.', parts: [{ name: 'Reconfiguración Pantalla Central', price: 0 }] } }
    },
    {
        id: 's_tapa_bloqueada', label: 'La portezuela del puerto de carga no obedece ni se abre', questions: [{ id: 'q1', text: '¿Si le das golpecitos suaves alrededor y al botón de llave, suena el motorcito?', yes: 'mecanismo_tapa', no: 'motor_tapa_quemado' }],
        diagnoses: { mecanismo_tapa: { title: 'Engranaje Bisagra Puerto Roto', text: 'El plástico interno dentado ha patinado o está lleno de suciedad y no empuja la puerta.', parts: [{ name: 'Mecanismo Tapa / Bisagra Motorizada', price: 130 }] }, motor_tapa_quemado: { title: 'Fallo Eléctrico Motor Apertura', text: 'Se ha cortado la comunicación BCM a ese puerto, o el motor de la tapa está en corto.', parts: [{ name: 'Motor Cierre Tapa Puerto', price: 55 }] } }
    },
    {
        id: 's_regeneracion_bruta', label: 'Frenada a trompicones bruscos (Como si pisaras chapas de metal, salta)', questions: [{ id: 'q1', text: '¿El asfalto está bacheado, empedrado o llueve mucho?', yes: 'abs_interferencia', no: 'resolver_motor' }],
        diagnoses: { abs_interferencia: { title: 'Corte de Regeneración por Grip (ABS)', text: 'El sistema detecta una micro pérdida de adherencia en el eje motor y cancela el freno eléctrico para evitar trompos.', parts: [{ name: 'Juego de Neumáticos Delanteros (Poca Adherencia)', price: 190 }] }, resolver_motor: { title: 'Fallo Sensor Angulo Rotor (Resolver)', text: 'El inversor pierde por milisegundos la posición del motor y envía picos de torque negativos erróneos.', parts: [{ name: 'Sensor Resolver Encóder', price: 240 }] } }
    },
    {
        id: 's_alarma_carga', label: 'Se activa la bocina y alarma del coche de madrugada mientras carga', questions: [{ id: 'q1', text: '¿Ocurre justo cuando el cargador "termina" de cargar e intenta dormir el coche?', yes: 'masa_flotante', no: 'sensor_inclinacion' }],
        diagnoses: { masa_flotante: { title: 'Interferencia Tierra/Neutro Wallbox', text: 'Un cambio sutil en el voltaje del Neutro de la comunidad hace saltar la protección anti-intrusiones eléctrica.', parts: [{ name: 'Revisión Toma de Tierra Cuadro', price: 80 }] }, sensor_inclinacion: { title: 'Falsa Alarma Volumétrica/Inclinación', text: 'El coche vibra por el compresor de batería o viento, engañando a los sensores de robo.', parts: [{ name: 'Calibración Módulo Alarma', price: 45 }] } }
    },
    {
        id: 's_led_rojo', label: 'Luz roja en el puerto y cargador se pone en PAUSA infinito', questions: [{ id: 'q1', text: '¿Pasa en DC súper rápidos y hace un ruido fuerte de "POM" en el maletero?', yes: 'hard_fault_obc', no: 'necesita_reset' }],
        diagnoses: { hard_fault_obc: { title: 'Fallo Aislamiento Contactor Rápido', text: 'El contactor principal de DC ha detectado arco eléctrico y se ha protegido cerrándose de golpe.', parts: [{ name: 'Relé / Contactor DC Batería Alta Tensión', price: 310 }] }, necesita_reset: { title: 'Timoeut Protocolo CCS', text: 'Problema de Handshake informático entre el coche y el poste (Poste de pago falló).', parts: [{ name: 'Cerrar el coche y esperar 10 min', price: 0 }] } }
    },
    {
        id: 's_olor_plastico', label: 'Olor muy fuerte a baquelita quemada/amoniaco en el habitáculo trasero', questions: [{ id: 'q1', text: '¿Llevas circulando a velocidad máxima por autopista mucho rato?', yes: 'conector_bateria_quemado', no: 'aire_acondicionado_bateria' }],
        diagnoses: { conector_bateria_quemado: { title: 'Derretimiento Busbar Alta Tensión', text: 'Tornillo de unión estructural de la batería flojo internamente generando una barbaridad de calor resistivo.', parts: [{ name: 'Reparación Pack (Reapriete y Busbar Nuevo)', price: 550 }] }, aire_acondicionado_bateria: { title: 'Fuga Gas Refrigerante al Habitáculo', text: 'Evaporador del interior del pack de baterías fisurado, expulsando el gas al interior del coche.', parts: [{ name: 'Evaporador / Junta HVAC Pack', price: 420 }] } }
    }
];
