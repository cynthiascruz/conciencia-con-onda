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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    comment: {text: texto},
                    languages: ['es'],
                    requestedAttributes: {TOXICITY: {}},
                }),
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
        const score = data.attributeScores.TOXICITY.summaryScore.value;

        logger.info('Score de moderación ${ score.toFixed(2) }');

        if (score >= 0.85) return 'Eliminada';
        if (score >= 0.60) return 'Pendiente';
        return 'Publicada';
    } catch (error) {
        logger.error('Error al moderar con IA', {error: error.message});
        return 'Pendiente'; // En caso de error, dejamos la reseña como 'Pendiente'
    }
};

