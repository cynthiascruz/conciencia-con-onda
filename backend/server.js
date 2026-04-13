import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { connect } from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import usuarioRoutes from './routes/usuario.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import lugarRoutes from './routes/lugar.routes.js';

dotenv.config();

connectDB();

const app = express();

// Middlewares globales
app.use(cors({
    origin: 'http://localhost:5173',  //Cambiar por el URL del frontend (DevTunnels o hosteado) 
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/lugares', lugarRoutes);



// Rutas de prueba 
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Conciencia con Onda funcionando' })
})

app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})