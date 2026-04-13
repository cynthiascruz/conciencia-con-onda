//Script para poblar la BD con Usuarios
//Se ejecuta con el comando: node seeders/usuarios.seed.js
//Este semillero se creó con la finalidad de probar las funcionalidades con Postman.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const salt = await bcrypt.genSalt(10);

        const usuarios = [
            {
                nombre: 'Admin',
                apellido: 'Principal',
                email: 'admin@concienciacononda.com',
                password: await bcrypt.hash('Admin1234!', salt),
                rol: 'Admin',
                estado: 'Protegido',
            },
            {
                nombre: 'Juan',
                apellido: 'Martínez',
                email: 'juan@mail.com',
                password: await bcrypt.hash('Usuario1234!', salt),
                rol: 'Usuario',
                estado: 'Activo',
            },
        ];

        for (const usuario of usuarios) {
            const existe = await Usuario.findOne({ email: usuario.email });
            if (existe) {
                console.log(`Usuario ya existe, omitiendo: ${usuario.email}`);
                continue;
            }
            await Usuario.create(usuario);
            console.log(`Usuario creado: ${usuario.email}`);
        }

    } catch (error) {
        console.error('Error en el seed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
        process.exit(0);
    }
};

seed();