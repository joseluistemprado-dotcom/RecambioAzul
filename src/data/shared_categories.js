export const frenos_pro_symptoms = [
    { id: 's_abs', label: 'Testigo ABS/ESP encendido', questions: [{ id: 'q1', text: '¿Ha fallado tras cambiar ruedas?', yes: 'sensor_abs_sucio', no: 'centralita_abs' }], diagnoses: { 'sensor_abs_sucio': { title: 'Sensor de Rueda Defectuoso', text: 'Lectura incorrecta de velocidad de rueda.', parts: [{ name: 'Sensor ABS', price: 25 }] }, 'centralita_abs': { title: 'Fallo Módulo Hidráulico ABS', text: 'Fallo interno en la electrónica de frenado.', parts: [{ name: 'Modulo ABS Reconstruido', price: 300 }] } } }
];

export const chasis_ruedas_symptoms = [
    { id: 's_desgaste_irregular', label: 'Desgaste por los bordes (Tire Wear Diagnostics)', questions: [{ id: 'q1', text: '¿Vibra el volante a partir de 100km/h?', yes: 'equilibrado_alineado', no: 'silentblocks' }], diagnoses: { 'equilibrado_alineado': { title: 'Desalineación y Mal Equilibrado', text: 'Geometría de dirección fuera de cotas.', parts: [{ name: 'Neumático 205/55 R16', price: 65 }] }, 'silentblocks': { title: 'Silentblocks de Trapecio Rajados', text: 'Holgura en brazos de suspensión.', parts: [{ name: 'Kit Trapecios Delanteros', price: 180 }] } } }
];

export const iluminacion_symptoms = [
    { id: 's_xenon', label: 'Faro Xenon parpadea o se apaga', questions: [{ id: 'q1', text: '¿La luz está rosada?', yes: 'bombilla_xenon', no: 'balastro' }], diagnoses: { 'bombilla_xenon': { title: 'Bombilla Xenon Agotada', text: 'Vida útil del gas finalizada.', parts: [{ name: 'Bombilla D1S Osram', price: 80 }] }, 'balastro': { title: 'Fallo Balastro Electrónico', text: 'El transformador de alta tensión ha fallado.', parts: [{ name: 'Balastro Xenon', price: 120 }] } } },
    { id: 's_limpia', label: 'Limpia parabrisas no funciona o hace ruido', questions: [{ id: 'q1', text: '¿Huele a quemado?', yes: 'motor_limpia', no: 'varillaje_atascado' }], diagnoses: { 'motor_limpia': { title: 'Quemado de Motor Limpia', text: 'Fallo eléctrico interno por sobreesfuerzo.', parts: [{ name: 'Motor Limpiaparabrisas', price: 70 }] }, 'varillaje_atascado': { title: 'Mecanismo de Limpia Bloqueado', text: 'Oxido en las rótulas del varillaje.', parts: [{ name: 'Varillaje Limpia', price: 45 }] } } }
];

export const confort_body_symptoms = [
    { id: 's_ventanilla', label: 'Ventanilla no sube (se oye motor)', questions: [{ id: 'q1', text: '¿Cristal caído al fondo?', yes: 'elevalunas_roto', no: 'pulsador' }], diagnoses: { 'elevalunas_roto': { title: 'Rotura de Mecanismo Elevalunas', text: 'Cables de acero trenzado cortados.', parts: [{ name: 'Elevalunas con Motor', price: 95 }] }, 'pulsador': { title: 'Fallo Interruptor de Ventanilla', text: 'Contactos internos sucios o quemados.', parts: [{ name: 'Botonera Principal', price: 35 }] } } },
    { id: 's_climatizador', label: 'Sale aire frío por un lado y caliente por otro', questions: [{ id: 'q1', text: '¿Se oyen "clics" tras el salpicadero?', yes: 'servomotor', no: 'compuerta_atascada' }], diagnoses: { 'servomotor': { title: 'Fallo Servomotor de Mezcla', text: 'El motor eléctrico de la trampilla no mueve.', parts: [{ name: 'Servomotor Climatizador', price: 60 }] }, 'compuerta_atascada': { title: 'Compuerta Obstruida', text: 'Bloqueo mecánico del flujo de aire.', parts: [{ name: 'Filtro Habitáculo Polen', price: 15 }] } } }
];

export const transmision_pro_symptoms = [
    { id: 's_dsg', label: 'Tirones en cambio automático (DSG/ZF)', questions: [{ id: 'q1', text: '¿Parpadea la letra P/R/D?', yes: 'mechatronica', no: 'mantenimiento_caja' }], diagnoses: { 'mechatronica': { title: 'Fallo Unidad Mecatrónica', text: 'Fallo en el cerebro electro-hidráulico del cambio.', parts: [{ name: 'Unidad Mecatrónica Reac.', price: 650 }] }, 'mantenimiento_caja': { title: 'Aceite de Caja Agotado/Sucio', text: 'Necesita mantenimiento inmediato para evitar daños.', parts: [{ name: 'Kit Aceite y Filtro Caja', price: 180 }] } } }
];

// Add 20 new generic symptoms per category
const generateSharedData = () => {
    for (let i = 1; i <= 20; i++) {
        frenos_pro_symptoms.push({
            id: `s_fre_new_${i}`, label: `Problema de frenado ${i} - Pedal esponjoso / largo`,
            questions: [{ id: 'q1', text: '¿Hay pérdida visible de líquido oscuro?', yes: 'latiguillo_roto', no: 'bomba_freno' }],
            diagnoses: {
                latiguillo_roto: { title: 'Fuga en Latiguillo Flex', text: 'Goma cuarteada por tiempo o mordida de roedor.', parts: [{ name: 'Latiguillo de Freno Rueda', price: 30 }] },
                bomba_freno: { title: 'Bomba Maestra Cedida', text: 'Retenes internos pierden presión de vuelta al bote.', parts: [{ name: 'Cilindro Maestro de Freno', price: 120 }] }
            }
        });

        chasis_ruedas_symptoms.push({
            id: `s_cha_new_${i}`, label: `Anomalía de suspensión ${i} - Ruido clonk en baches`,
            questions: [{ id: 'q1', text: '¿Solo suena al girar el volante en parado?', yes: 'copela_roto', no: 'bieleta_estabilizadora' }],
            diagnoses: {
                copela_roto: { title: 'Rodamiento de Copela Bloqueado', text: 'Fricción en la parte alta del amortiguador al girar.', parts: [{ name: 'Kit Copelas Amortiguador', price: 45 }] },
                bieleta_estabilizadora: { title: 'Rótula de Bieleta Gastada', text: 'Holgura metálica que transmite ruido en badenes.', parts: [{ name: 'Bieleta Barra Estabilizadora', price: 28 }] }
            }
        });

        iluminacion_symptoms.push({
            id: `s_ilu_new_${i}`, label: `Fallo eléctrico luces ${i} - Cortocircuito en piloto`,
            questions: [{ id: 'q1', text: '¿Al pisar el freno se enciende el intermitente?', yes: 'masa_corta', no: 'portalámparas_quemado' }],
            diagnoses: {
                masa_corta: { title: 'Falta de Masa en Piloto Trasero', text: 'La corriente retorna por otros filamentos creando el fallo.', parts: [{ name: 'Conector de Piloto y Cableado', price: 15 }] },
                portalámparas_quemado: { title: 'Placa Base Derretida', text: 'Contacto suelto sobrecalentado el plástico.', parts: [{ name: 'Portalámparas Trasero Base', price: 35 }] }
            }
        });

        confort_body_symptoms.push({
            id: `s_con_new_${i}`, label: `Problema habitáculo ${i} - Bloqueo de puerta trasera`,
            questions: [{ id: 'q1', text: '¿Tampoco abre desde dentro?', yes: 'supercondenacion', no: 'cable_tirador' }],
            diagnoses: {
                supercondenacion: { title: 'Cerradura Trabada Safelock', text: 'Motor eléctrico clavado en posición de seguridad infantil.', parts: [{ name: 'Módulo Cerradura Puerta', price: 85 }] },
                cable_tirador: { title: 'Cable Bowden Estirado/Roto', text: 'Tirador de la manilla desenchufado mecánicamente de la cerradura.', parts: [{ name: 'Cable Tirador Interior', price: 18 }] }
            }
        });

        transmision_pro_symptoms.push({
            id: `s_tra_new_${i}`, label: `Anomalía de tracción ${i} - Vibración al acelerar en carga`,
            questions: [{ id: 'q1', text: '¿Se nota en el túnel central?', yes: 'flector_cardan', no: 'palier_homocinetico' }],
            diagnoses: {
                flector_cardan: { title: 'Flector Árbol Transmisión Roto', text: 'Goma de acople entre caja y diferencial desgarrada.', parts: [{ name: 'Flector Goma Cardán', price: 75 }] },
                palier_homocinetico: { title: 'Junta Homocinética Interior Tripode Seca', text: 'Pérdida de grasa, rodamiento de agujas destruido.', parts: [{ name: 'Palier Semieje Completo', price: 160 }] }
            }
        });
    }
}
generateSharedData();
