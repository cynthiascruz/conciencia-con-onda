// Este archivo maneja las rutas relacionadas con los usuarios

import { Router } from 'express';
import { listarUsuarios, cambiarRol, cambiarEstado } from '../controllers/usuarioController.js';
import { protegerRuta, soloAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Todos los endpoints de usuarios requieren autenticación y rol de admin
router.get ('/', protegerRuta, soloAdmin, listarUsuarios);
router.patch('/:id/rol', protegerRuta, soloAdmin, cambiarRol);
router.patch('/:id/estado', protegerRuta, soloAdmin, cambiarEstado);

export default router;