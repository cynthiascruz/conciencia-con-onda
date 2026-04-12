// Este archivo maneja las rutas relacionadas con las categorías

import { Router } from 'express';
import { listarCategorias } from '../controllers/categoriaController.js';

const router = Router();

// Endpoint para listar categorías (público)
router.get('/', listarCategorias);

export default router;