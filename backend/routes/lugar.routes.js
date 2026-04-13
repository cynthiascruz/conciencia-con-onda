// Este archivo maneja las rutas relacionadas con los lugares
import { Router } from 'express';
import {
    listarLugares,
    obtenerLugar,
    listarLugaresAdmin,
    proponerLugar,
    editarLugar,
    cambiarEstadoLugar,
} from '../controllers/lugarController.js';
import { protegerRuta, soloAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Públicos
router.get('/', listarLugares);
router.get('/:id', obtenerLugar);

// Solo Admin
router.get('/admin/todos', protegerRuta, soloAdmin, listarLugaresAdmin);
router.patch('/:id', protegerRuta, soloAdmin, editarLugar);
router.patch('/:id/estado', protegerRuta, soloAdmin, cambiarEstadoLugar);

// Usuario registrado
router.post('/', protegerRuta, proponerLugar);

export default router;