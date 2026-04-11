//routes/auth.routes.js
// Este archivo define las rutas relacionadas con la autenticación, como el registro, login y logout.

import { Router } from 'express';
import { registro, login , logout} from '../controllers/authController.js';

const router = Router();

// Ruta para registro de usuario
router.post('/registro', registro);
// Ruta para el login de usuario
router.post('/login', login);
// Ruta para logout de usuario
router.post('/logout', logout);

export default router;