import { bateria_carga_symptoms } from './bateria_carga.js';
import { 
    turbo_admision_symptoms, 
    refrigeracion_symptoms, 
    gasoline_symptoms, 
    diesel_symptoms 
} from './engine_modules.js';
import { 
    frenos_pro_symptoms, 
    chasis_ruedas_symptoms, 
    iluminacion_symptoms, 
    confort_body_symptoms, 
    transmision_pro_symptoms 
} from './shared_categories.js';

export const diagnosticData = {
    electric: [
        {
            id: 'bateria_carga',
            label: 'Batería y Carga',
            icon: '🔋',
            symptoms: bateria_carga_symptoms
        },
        {
            id: 'turbo_admision',
            label: 'Turbo y Admisión',
            icon: '🐌',
            symptoms: turbo_admision_symptoms
        },
        {
            id: 'refrigeracion',
            label: 'Sist. Refrigeración',
            icon: '🌡️',
            symptoms: refrigeracion_symptoms
        }
    ],
    gasoline: [
        {
            id: 'motor_gasolina',
            label: 'Motor Gasolina',
            icon: '⛽',
            symptoms: gasoline_symptoms
        }
    ],
    diesel: [
        {
            id: 'motor_diesel',
            label: 'Motor Diésel',
            icon: '🛢️',
            symptoms: diesel_symptoms
        }
    ],
    shared: [
        {
            id: 'frenos_pro',
            label: 'Frenos ABS/ESP',
            icon: '🛑',
            symptoms: frenos_pro_symptoms
        },
        {
            id: 'chasis_ruedas',
            label: 'Chasis y Neumáticos',
            icon: '🚜',
            symptoms: chasis_ruedas_symptoms
        },
        {
            id: 'iluminacion',
            label: 'Luces y Visibilidad',
            icon: '🔦',
            symptoms: iluminacion_symptoms
        },
        {
            id: 'confort_body',
            label: 'Cuerpo y Confort',
            icon: '🏢',
            symptoms: confort_body_symptoms
        },
        {
            id: 'transmision_pro',
            label: 'Transmisión Pro',
            icon: '⚙️',
            symptoms: transmision_pro_symptoms
        }
    ]
};
