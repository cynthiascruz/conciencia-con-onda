//Script para poblar la BD con categorías
//Se ejecuta con el comando: node seeders/categorias

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Categoria from '../models/Categoria.js';

dotenv.config();

const categorias = [
    { nombre: 'Restaurante' },
    { nombre: 'Museo' },
    { nombre: 'Parque' },
    { nombre: 'Hotel' },
    { nombre: 'Centro Comercial' },
    { nombre: 'Educación' },
    { nombre: 'Deporte' },
    { nombre: 'Entretenimiento' },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB exitosa');

        await Categoria.deleteMany();
        console.log('Categorías eliminadas');

        await Categoria.insertMany(categorias);
        console.log('Categorías insertadas');
    } catch (error) {
        console.error('Error al poblar las categorías:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
        process.exit(0);
    }
};

seed();