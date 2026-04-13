// controllers/lugarController.js
import Lugar from '../models/Lugar.js';
import logger from '../utils/logger.js';

/*
    Listar lugares aprobados con filtros opcionales
    Método: GET
    Ruta: /api/lugares
    Acceso: Público
*/
export const listarLugares = async (req, res, next) => {
    try {
        const { categoria, caracteristica } = req.query;

        const filtro = { estado: 'Aprobado' };

        if (categoria) filtro.categoria = categoria;
        if (caracteristica) filtro.caracteristicas_accesibilidad = caracteristica;

        const lugares = await Lugar.find(filtro)
            .populate('categoria', 'nombre')
            .populate('creadoPor_id', 'nombre apellido');

        logger.info('Listado de lugares obtenido', {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json(lugares);

    } catch (error) {
        next(error);
    }
};

/*
    Obtener detalle de un lugar
    Método: GET
    Ruta: /api/lugares/:id
    Acceso: Público
*/
export const obtenerLugar = async (req, res, next) => {
    try {
        const lugar = await Lugar.findById(req.params.id)
            .populate('categoria', 'nombre')
            .populate('creadoPor_id', 'nombre apellido');

        if (!lugar) {
            return res.status(404).json({ mensaje: 'Lugar no encontrado.' });
        }

        logger.info(`Detalle de lugar obtenido: ${lugar.nombre}`, {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json(lugar);

    } catch (error) {
        next(error);
    }
};

/*
    Listar todos los lugares (para panel Admin)
    Método: GET
    Ruta: /api/lugares/admin
    Acceso: Solo Admin
*/
export const listarLugaresAdmin = async (req, res, next) => {
    try {
        const lugares = await Lugar.find()
            .populate('categoria', 'nombre')
            .populate('creadoPor_id', 'nombre apellido');

        logger.info('Listado completo de lugares obtenido (admin)', {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json(lugares);

    } catch (error) {
        next(error);
    }
};

/*
    Proponer un nuevo lugar
    Método: POST
    Ruta: /api/lugares
    Acceso: Usuario registrado
*/
export const proponerLugar = async (req, res, next) => {
    try {
        const {
            nombre,
            categoria,
            direccion,
            horario,
            descripcion,
            url_img,
            url_sitioweb,
            caracteristicas_accesibilidad,
        } = req.body;

        const lugar = await Lugar.create({
            nombre,
            categoria,
            direccion,
            horario,
            descripcion,
            url_img,
            url_sitioweb,
            caracteristicas_accesibilidad,
            creadoPor_id: req.usuario.id,
        });

        logger.info(`Lugar propuesto: ${lugar.nombre}`, {
            method: req.method, url: req.originalUrl, statusCode: 201,
        });

        return res.status(201).json({ mensaje: 'Lugar propuesto correctamente. Pendiente de revisión.', lugar });

    } catch (error) {
        next(error);
    }
};

/*
    Editar un lugar
    Método: PATCH
    Ruta: /api/lugares/:id
    Acceso: Solo Admin
*/
export const editarLugar = async (req, res, next) => {
    try {
        const lugar = await Lugar.findById(req.params.id);

        if (!lugar) {
            return res.status(404).json({ mensaje: 'Lugar no encontrado.' });
        }

        const camposPermitidos = [
            'nombre', 'categoria', 'direccion', 'horario',
            'descripcion', 'url_img', 'url_sitioweb', 'caracteristicas_accesibilidad'
        ];

        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                lugar[campo] = req.body[campo];
            }
        });

        await lugar.save();

        logger.info(`Lugar editado: ${lugar.nombre}`, {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json({ mensaje: 'Lugar actualizado correctamente.', lugar });

    } catch (error) {
        next(error);
    }
};

/*
    Cambiar estado de un lugar (aprobar / rechazar / inactivar)
    Método: PATCH
    Ruta: /api/lugares/:id/estado
    Acceso: Solo Admin
*/
export const cambiarEstadoLugar = async (req, res, next) => {
    try {
        const { estado } = req.body;

        if (!['Aprobado', 'Rechazado', 'Inactivo', 'Pendiente'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado inválido.' });
        }

        const lugar = await Lugar.findById(req.params.id);

        if (!lugar) {
            return res.status(404).json({ mensaje: 'Lugar no encontrado.' });
        }

        lugar.estado = estado;
        await lugar.save();

        logger.info(`Estado de lugar "${lugar.nombre}" cambiado a ${estado}`, {
            method: req.method, url: req.originalUrl, statusCode: 200,
        });

        return res.status(200).json({ mensaje: 'Estado actualizado correctamente.', lugar });

    } catch (error) {
        next(error);
    }
};