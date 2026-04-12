// Controlador de usuarios

import Usuario from '../models/Usuario.js';
import logger from '../utils/logger.js';

/*
    Obtener todos los usuarios
    Metodo: GET
    Ruta: /api/usuarios
    Acceso: Solo administradores
*/

export const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.find().select('-password');

        logger.info('Listado de usuarios obtenido', {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json(usuarios);

    } catch (error) {
        next(error);
    }
};

/*
    Cambiar el rol de un usuario
    Método: Patch
    Ruta: /api/usuarios/:id/rol
    Acceso: Solo administradores
*/

export const cambiarRol = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!['Admin', 'Usuario'].includes(rol)) {
            return res.status(400).json({ mensaje: 'Rol no válido' });
        }

        const usuario = await Usuario.findById(id).select('-password');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.estado === 'Protegido') {
            return res.status(403).json({ mensaje: 'Este usuario no se puede modificar' });
        }

        usuario.rol = rol;
        await usuario.save();

        logger.info('RRol de usuario ${usuario.email} cambiado a ${rol}', {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json({ mensaje: 'Rol actualizado', usuario });
    } catch (error) {
        next(error);
    }
};


/*
    Cambiar estado de usuario (suspender / activar)
    Método: PATCH
    Ruta: /api/usuarios/:id/estado
    Acceso: Solo Admin
*/


export const cambiarEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['Activo', 'Suspendido'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado inválido. Use Activo o Suspendido.' });
        }

        const usuario = await Usuario.findById(id).select('-password');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        if (usuario.estado === 'Protegido') {
            return res.status(403).json({ mensaje: 'Este usuario no puede ser modificado.' });
        }

        usuario.estado = estado;
        await usuario.save();

        logger.info(`Estado de usuario ${usuario.email} cambiado a ${estado}`, {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json({ mensaje: 'Estado actualizado correctamente.', usuario });

    } catch (error) {
        next(error);
    }
};