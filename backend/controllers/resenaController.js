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

/*
    Listar reseñas de un lugar
    Método: GET
    Ruta: /api/resenas/:lugarId
    Acceso: Público
    Orden: Reciente a antiguo
*/
export const listarResenas = async (req, res,next) => {
    try{
        const resenas = await Resena.find({
            id_lugar: req.params.lugarId,
            estado: 'Publicada'
        })
            .populate('id_autor', 'nombre apellido')
            .sort({fecha_Resena: -1});

        logger.info(`Reseñas listadas para lugar: ${req.params.lugarId}`,{
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json(resenas);

    } catch (error){
        next(error);
    }
};

/*
    Listar reseñas (publicadas y pendientes)
    Método: GET
    Ruta: /api/resenas/:ligarId/admin
    Acceso: Admin
*/

export const listarResenasAdmin = async (req, res,next) => {
    try {
        const resenas = await Resena.find({
            id_lugar: req.params.lugarId,
            estado: { $in: ['Publicada', 'Pendiente'] },
        })
            .populate('id_autor', 'nombre apellido email')
            .sort({ fecha_Resena: -1 });

            logger.info(`Reseñas listadas para admin del lugar: ${req.params.lugarId}`,{
                method: req.method, url: req.originalUrl, statusCode: 200,
            });
        return res.status(200).json(resenas);
    } catch (error) {
        next(error);
    }
};

/*
    Crear reseña
    Método: POST
    Ruta: /api/resenas
    Acceso: Usuario autenticado
*/
export const crearResena = async (req, res,next) => {
    try {
        const { id_lugar, tipo, descripcion } = req.body;

        // Validar campos obligatorios
        if (!id_lugar || !tipo || !descripcion) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        // Validación si el lugar existe
        const lugar = await Lugar.findById(id_lugar);
        if (!lugar) {
            return res.status(404).json({ mensaje: 'Lugar no encontrado' });
        }

        // Validar el estado de la reseña con IA
        const estado = await moderarConIA(descripcion);
        // Crear la reseña
        const Resena = await Resena.create({
            id_lugar,
            id_autor: req.usuario._id,
            tipo,
            descripcion,
            estado,
        });

        logger.info(`Reseña creada por: ${req.usuario.id} con estado: ${estado}`,{
            method: req.method, url: req.originalUrl, statusCode: 201,
        });

        const mensajes = {
            'Publicada': 'Reseña publicada exitosamente',
            'Pendiente': 'Reseña enviada para revisión, estará visible una vez aprobada por el admin',
            'Eliminada': 'Reseña rechazada por contener contenido inapropiado',
        };

        return res.status(201).json({ 
            mensaje: mensajes[estado], 
            estado, 
            resena,
        });

    } catch (error) {
        next(error);
    }
};