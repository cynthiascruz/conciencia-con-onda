// Middleware encargado de verificar tokens válidos y el rol del usuario (cuando se requiera).

import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

//Verificar token válido
export const protegerRuta = (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            logger.warn('Acceso sin token', { method: req.method, url: req.originalUrl, statusCode: 401 })
            return res.status(401).json({ message: 'Acceso no autorizado. Inicie sesión' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next()
        
    } catch (error) {
        logger.error('Token inválido', { method: req.method, url: req.originalUrl, statusCode: 401 })
        return res.status(401).json({ message: 'Token inválido o expirado. Inicie sesión nuevamente' });
    }
}

// Verificar rol

export const soloAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        logger.warn('Acceso denegado. Solo administradores', { 
            method: req.method, 
            url: req.originalUrl, 
            statusCode: 403 
        })
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
    }
    next();
}