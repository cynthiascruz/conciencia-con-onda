// Controlador para manejar las categorias 

import Categoria from '../models/Categoria.js';
import logger from '../utils/logger.js';

/*
    Listado de categorías.
    Método: GET
    Ruta: /api/categorias
    Acceso: Público
*/
export const listarCategorias = async (req, res, next) => {
    try {
        const categorias = await Categoria.find().sort({ nombre: 1 });
        logger.info('Listado de categorías obtenido',{
            method: req.method, url: req.originalUrl, statusCode : 200,
        });
        return res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};