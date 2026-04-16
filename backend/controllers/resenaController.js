import Resena from "../models/Resena.js";
import Lugar from "../models/Lugar.js";
import logger from "../utils/logger.js";

/*
    Moderación con IA
    Esta función analiza el texto y dependiendo el nivel de toxicidad retornará el estado de la reseña.
    Valores de toxicidad:
    - toxicidad < 0.60  → 'Publicada'  (aprobación automática)
    - toxicidad ≥ 0.60  → 'Pendiente'  (revisión manual por admin)
    - toxicidad ≥ 0.85  → 'Eliminada'  (rechazo automático)
 */
const moderarConIA = async (texto) => {
    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/unitary/multilingual-toxic-xlm-roberta`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
                },
                body: JSON.stringify({inputs: texto}),
            }
        );

        if (!response.ok) {
            // Si la API falla, dejamos la reseña como 'Pendiente'
            logger.warn('API no disponible, reseña marcada como Pendiente',{
                statusCode: response.status
            });
            return 'Pendiente';
        }

        const data = await response.json();

        // La API devuelve un [[{ label, score }, ...]] — extraemos el score de 'toxic'
        const resultados = data[0];
        const toxic = resultados.find(r => r.label === 'toxic');

        if (!toxic) {
            // Si no se encuentra la etiqueta 'toxic', asumimos que no es tóxico
            logger.warn('Etiqueta "toxic" no encontrada en la respuesta de la API, reseña marcada como Publicada',{
                payload: JSON.stringify(resultados),    
            });
            return 'Publicada';
        }

        const score = toxic.score;
        logger.info (`Resultados de moderación: ${score.toFixed(2)}`);

        // Validación Eliminda/Pendiente
        if(score >= .85) return 'Eliminada';
        if (score >= .60) return 'Pendiente';
        return 'Publicada';
    } catch (error){
        logger.warn (`Error inesperado ${error.message}. Estatus de reseña: Pendiente.`);
        return 'Pendiente';
    }
};
