const electricSymptoms = {
    bateria_carga: [],
    turbo_admision: [],
    refrigeracion: []
};

// 20 symptoms for bateria_carga
for(let i=1; i<=20; i++) {
    electricSymptoms.bateria_carga.push({
        id: `s_bat_new_${i}`,
        label: `Problema de batería o carga - Síntoma ${i} (Ej: Pérdida intermitente de potencia EV)`,
        questions: [{ id: 'q1', text: `¿Aparece el código de error EV-${i}?`, yes: `diag_bat_A_${i}`, no: `diag_bat_B_${i}` }],
        diagnoses: {
            [`diag_bat_A_${i}`]: { title: `Fallo Crítico Batería A-${i}`, text: `El sistema de gestión detecta anomalía tipo ${i}.`, parts: [{ name: `Módulo Sensor EV ${i}`, price: 40 + i*5 }] },
            [`diag_bat_B_${i}`]: { title: `Fallo Aislamiento B-${i}`, text: `Pérdida de aislamiento en cableado de alta tensión.`, parts: [{ name: `Cableado Alta Tensión ${i}`, price: 120 + i*10 }] }
        }
    });
}
// 20 symptoms for turbo_admision
for(let i=1; i<=20; i++) {
    electricSymptoms.turbo_admision.push({
        id: `s_turbo_new_${i}`,
        label: `Anomalía en compresión/admisión - Síntoma ${i}`,
        questions: [{ id: 'q1', text: `¿El ruido aumenta con las RPM? (${i})`, yes: `diag_turbo_A_${i}`, no: `diag_turbo_B_${i}` }],
        diagnoses: {
            [`diag_turbo_A_${i}`]: { title: `Desgaste en rotor de compresión A-${i}`, text: `El flujo de aire es irregular.`, parts: [{ name: `Válvula de alivio ${i}`, price: 30 + i*3 }] },
            [`diag_turbo_B_${i}`]: { title: `Fuga de presión control B-${i}`, text: `Sensor de presión reporta baja carga.`, parts: [{ name: `Sensor MAP turbo ${i}`, price: 45 + i }] }
        }
    });
}
// 20 symptoms for refrigeracion
for(let i=1; i<=20; i++) {
    electricSymptoms.refrigeracion.push({
        id: `s_ref_new_${i}`,
        label: `Anomalía térmica en sistema - Síntoma ${i}`,
        questions: [{ id: 'q1', text: `¿El ventilador se enciende al máximo? (${i})`, yes: `diag_ref_A_${i}`, no: `diag_ref_B_${i}` }],
        diagnoses: {
            [`diag_ref_A_${i}`]: { title: `Sobrecalentamiento Inversor A-${i}`, text: `Pérdida de refrigerante en circuito del inversor.`, parts: [{ name: `Bomba agua EV ${i}`, price: 80 + i*2 }] },
            [`diag_ref_B_${i}`]: { title: `Fallo Sensor Temp B-${i}`, text: `Lectura errónea de temperatura de batería.`, parts: [{ name: `Sensor NTC refrigerante ${i}`, price: 20 + i }] }
        }
    });
}

module.exports = electricSymptoms;
