// Este archivo se encarga del manejo de errores con el fin de evitar repetición de código en cada controlador.

import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const mensaje = err.message || 'Error interno del servidor';

    logger.error(mensaje, { 
        method: req.method,
        url: req.originalUrl,
        statusCode, 
        });

        res.status(statusCode).json({ message: mensaje });
};

export default errorHandler;