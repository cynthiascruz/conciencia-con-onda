// Archivo que maneja las rutas relacionadas con las reseñas
import { Router } from 'express';
import {
    listarResenas,
    listarResenasAdmin,
    crearResena,
    cambiarEstadoResena,
    //misResenas,
} from '../controllers/resenaController.js';
import { protegerRuta, soloAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Publico - solo reseñas de un lugar
router.get('/:lugarId', listarResenas);

//  Usuario registrado - Crear reseñas
router.post('/', protegerRuta, crearResena);

// Solo Admin - ver reseñas pendientes y publicadas
router.get('/:lugarId/admin', protegerRuta, soloAdmin, listarResenasAdmin);

// Solo Admin - Cambiar estado de reseña
router.patch('/:id/estado', protegerRuta, soloAdmin, cambiarEstadoResena);

// Ver reseñas de un usuario (Posible feature futura)
//router.get('/mis-resenas', protegerRuta, misResenas);

export default router;