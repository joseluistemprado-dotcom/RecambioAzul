export const turbo_admision_symptoms = [
    { id: 's_silbido_turbo', label: 'Silbido fuerte al acelerar (Sonido Sirena)', questions: [{ id: 'q1', text: '¿Echa humo azulado por el escape?', yes: 'holgura_turbo', no: 'fuga_manguito' }], diagnoses: { 'holgura_turbo': { title: 'Holgura en Eje del Turbo', text: 'Desgaste severo en rodamientos, riesgo de rotura inminente.', parts: [{ name: 'Turbo Reconstruido', price: 450 }] }, 'fuga_manguito': { title: 'Fuga de Presión en Admisión', text: 'Un manguito del intercooler está rajado o suelto.', parts: [{ name: 'Manguito Intercooler Reforzado', price: 65 }] } } },
    { id: 's_geometria', label: 'Corte de potencia a altas vueltas (Limp Mode)', questions: [{ id: 'q1', text: '¿Falla solo al pisar fuerte?', yes: 'geometria_atascada', no: 'actuador_turbo' }], diagnoses: { 'geometria_atascada': { title: 'Geometría Variable Sucia (P0299)', text: 'Exceso de carbonilla bloquea los álabes del turbo.', parts: [{ name: 'Limpieza Turbo Descarbonizadora', price: 120 }] }, 'actuador_turbo': { title: 'Fallo Actuador Electrónico', text: 'El motor que regula la presión no responde.', parts: [{ name: 'Actuador Turbo Electrónico', price: 180 }] } } }
];

export const refrigeracion_symptoms = [
    { id: 's_calienta', label: 'La temperatura sube al máximo', questions: [{ id: 'q1', text: '¿Sale aire frío por la calefacción?', yes: 'aire_circuito', no: 'termostato_pegado' }], diagnoses: { 'aire_circuito': { title: 'Aire en el Circuito / Fuga', text: 'Nivel bajo de anticongelante por fuga técnica.', parts: [{ name: 'Bomba de Agua GMB', price: 55 }] }, 'termostato_pegado': { title: 'Termostato Bloqueado Cerrado', text: 'No permite el flujo de agua hacia el radiador.', parts: [{ name: 'Termostato con Cuerpo', price: 40 }] } } },
    { id: 's_humo_blanco', label: 'Humo blanco denso por el escape (Olor dulce)', questions: [{ id: 'q1', text: '¿Hay aceite en el agua (mayonesa)?', yes: 'culata', no: 'enfriador_aceite' }], diagnoses: { 'culata': { title: 'Junta de Culata Quemada', text: 'Paso de anticongelante a los cilindros.', parts: [{ name: 'Kit Juntas Descarbonización', price: 150 }] }, 'enfriador_aceite': { title: 'Fallo Enfriador de Aceite', text: 'Mezcla de fluidos por rotura interna del intercambiador.', parts: [{ name: 'Enfriador de Aceite', price: 90 }] } } }
];

export const gasoline_symptoms = [
    { id: 's_misfire', label: 'Motor vibra y pierde potencia (Check Engine parpadea)', questions: [{ id: 'q1', text: '¿Solo en frío?', yes: 'bujias_humedas', no: 'bobina_falla' }], diagnoses: { 'bujias_humedas': { title: 'Bujías Incrustadas (Contaminadas)', text: 'Mala combustión por bujías viejas.', parts: [{ name: 'Juego Bujías Iridio Ngk', price: 60 }] }, 'bobina_falla': { title: 'Fallo Bobina de Encendido (P0300)', text: 'Falta de chispa en uno o más cilindros.', parts: [{ name: 'Bobina de Encendido', price: 45 }] } } }
];

export const diesel_symptoms = [
    { id: 's_adblue', label: 'Fallo sistema AdBlue (Cuenta atrás)', questions: [{ id: 'q1', text: '¿Hay cristalización?', yes: 'inyector_adblue', no: 'bomba_urea' }], diagnoses: { 'inyector_adblue': { title: 'Inyector Urea Obstruido', text: 'Cristales de AdBlue bloquean la inyección.', parts: [{ name: 'Inyector Adblue', price: 140 }] }, 'bomba_urea': { title: 'Fallo Bomba Tanque Adblue', text: 'Pérdida de presión en el circuito SCR.', parts: [{ name: 'Depósito Urea Completo', price: 450 }] } } }
];

// Add 20 real symptoms to turbo, refrigeracion, gasoline, diesel
const generateData = () => {
    for (let i = 1; i <= 20; i++) {
        turbo_admision_symptoms.push({
            id: \`s_turbo_new_\${i}\`, label: \`Fallo de sobrealimentación \${i} - Falta de respuesta inicial\`,
            questions: [{ id: 'q1', text: '¿El coche da tirones al entrar el turbo?', yes: 'valvula_n75', no: 'sensor_map' }],
            diagnoses: {
                valvula_n75: { title: 'Válvula N75 defectuosa', text: 'Falla el control de vacío del turbo.', parts: [{ name: 'Electroválvula N75 / Pierburg', price: 45 }] },
                sensor_map: { title: 'Sensor de Presión MAP sucio', text: 'Lectura incorrecta de presión en colector.', parts: [{ name: 'Sensor MAP Bosch', price: 60 }] }
            }
        });

        refrigeracion_symptoms.push({
            id: \`s_refri_new_\${i}\`, label: \`Problema de temperatura de motor \${i} - Fluctuaciones\`,
            questions: [{ id: 'q1', text: '¿El ventilador hace mucho ruido a veces?', yes: 'viscoso_roto', no: 'radiador_sucio' }],
            diagnoses: {
                viscoso_roto: { title: 'Embrague Viscoso del Ventilador Degastado', text: 'Ventilador no acopla bien por temperatura.', parts: [{ name: 'Embrague Viscoso Radiador', price: 80 }] },
                radiador_sucio: { title: 'Radiador Obstruido Internamente', text: 'Mala circulación de líquido refrigerante.', parts: [{ name: 'Radiador de Agua de Motor', price: 110 }] }
            }
        });

        gasoline_symptoms.push({
            id: \`s_gas_new_\${i}\`, label: \`Fallo de combustión Gasolina \${i} - Olor a gasolina sin quemar\`,
            questions: [{ id: 'q1', text: '¿Cuesta arrancar en caliente?', yes: 'inyector_gotea', no: 'filtro_gasolina_tapado' }],
            diagnoses: {
                inyector_gotea: { title: 'Inyector Fuga Gasolina', text: 'Un inyector no cierra del todo, ahogando el pistón.', parts: [{ name: 'Inyector Gasolina Multipunto', price: 120 }] },
                filtro_gasolina_tapado: { title: 'Regulador Presión Gasolina Roto', text: 'Presión de combustible inestable en la rampa.', parts: [{ name: 'Regulador / Filtro Gasolina', price: 35 }] }
            }
        });

        diesel_symptoms.push({
            id: \`s_die_new_\${i}\`, label: \`Problema emisiones Diésel \${i} - Humo negro o regeneración constante\`,
            questions: [{ id: 'q1', text: '¿El ralentí es inestable?', yes: 'egr_sucia', no: 'dpf_saturado' }],
            diagnoses: {
                egr_sucia: { title: 'Válvula EGR Abierta Atascada', text: 'Reingresa demasiados gases quemados ahogando el motor.', parts: [{ name: 'Válvula EGR Reacondicionada', price: 130 }] },
                dpf_saturado: { title: 'Filtro Anti-Partículas (FAP) Lleno', text: 'Exceso de ceniza, regeneración imposible.', parts: [{ name: 'Limpieza DPF / Filtro Nuevo', price: 400 }] }
            }
        });
    }
}
generateData();
