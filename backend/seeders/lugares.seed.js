//Script para poblar la BD con Lugares
//Se ejecuta con el comando: node seeders/lugares.seed.js
//Este semillero se creó con la finalidad de probar las funcionalidades con Postman.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lugar from '../models/Lugar.js';
import Usuario from '../models/Usuario.js';

dotenv.config();

const ID_RESTAURANTE      = '69db2148752b278f69af9dc6';
const ID_MUSEO            = '69db2148752b278f69af9dc7';
const ID_CENTRO_COMERCIAL = '69db2148752b278f69af9dca';

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const admin = await Usuario.findOne({ rol: 'Admin' });
        if (!admin) throw new Error('No se encontró un usuario Admin. Ejecuta primero usuarios.seed.js');

        const lugares = [
            {
                nombre: 'Restaurante Pangea',
                categoria: ID_RESTAURANTE,
                direccion: 'Ave. Lázaro Cárdenas 2499, Valle Oriente, San Pedro Garza García, N.L.',
                horario: 'Lun-Sáb 13:00 - 23:00, Dom 13:00 - 18:00',
                descripcion: 'Restaurante de alta cocina con espacios amplios y accesibles para personas con movilidad reducida.',
                url_img: '',
                url_sitioweb: 'https://www.restaurantepangea.com',
                caracteristicas_accesibilidad: ['rampa de acceso', 'baño accesible', 'espacio amplio', 'estacionamiento accesible'],
                estado: 'Aprobado',
                creadoPor_id: admin._id,
            },
            {
                nombre: 'Museo de Historia Mexicana',
                categoria: ID_MUSEO,
                direccion: 'Dr. Coss 445 Sur, Centro, Monterrey, N.L.',
                horario: 'Mar-Dom 10:00 - 18:00',
                descripcion: 'Museo con recorridos accesibles, rampas en todas las salas y personal capacitado para asistir a visitantes con discapacidad.',
                url_img: '',
                url_sitioweb: 'https://www.3museos.com',
                caracteristicas_accesibilidad: ['rampa de acceso', 'elevador', 'baño accesible', 'silla de ruedas', 'personal capacitado', 'señalización braille'],
                estado: 'Aprobado',
                creadoPor_id: admin._id,
            },
            {
                nombre: 'Museo del Acero Horno 3',
                categoria: ID_MUSEO,
                direccion: 'Fundidora 110, Obrera, Monterrey, N.L.',
                horario: 'Mar-Dom 10:00 - 18:00',
                descripcion: 'Espacio cultural dentro del Parque Fundidora con accesos adaptados y recorridos guiados inclusivos.',
                url_img: '',
                url_sitioweb: 'https://www.horno3.mx',
                caracteristicas_accesibilidad: ['rampa de acceso', 'elevador', 'baño accesible', 'personal capacitado', 'espacio amplio'],
                estado: 'Aprobado',
                creadoPor_id: admin._id,
            },
            {
                nombre: 'Galerías Valle Oriente',
                categoria: ID_CENTRO_COMERCIAL,
                direccion: 'Ave. Lázaro Cárdenas 1000, Valle Oriente, San Pedro Garza García, N.L.',
                horario: 'Lun-Dom 11:00 - 21:00',
                descripcion: 'Centro comercial con múltiples elevadores, rampas en todos los accesos y estacionamiento exclusivo para personas con discapacidad.',
                url_img: '',
                url_sitioweb: 'https://www.galeriasvalle.com.mx',
                caracteristicas_accesibilidad: ['rampa de acceso', 'elevador', 'baño accesible', 'estacionamiento accesible', 'espacio amplio', 'silla de ruedas'],
                estado: 'Aprobado',
                creadoPor_id: admin._id,
            },
            {
                nombre: 'Café Toscano Barrio Antiguo',
                categoria: ID_RESTAURANTE,
                direccion: 'Morelos 1044, Barrio Antiguo, Monterrey, N.L.',
                horario: 'Lun-Dom 8:00 - 22:00',
                descripcion: 'Café propuesto por un usuario, pendiente de verificación de accesibilidad por parte del equipo.',
                url_img: '',
                url_sitioweb: '',
                caracteristicas_accesibilidad: ['entrada accesible', 'espacio amplio'],
                estado: 'Pendiente',
                creadoPor_id: admin._id,
            },
        ];

        for (const lugar of lugares) {
            const existe = await Lugar.findOne({ nombre: lugar.nombre });
            if (existe) {
                console.log(`Lugar ya existe, omitiendo: ${lugar.nombre}`);
                continue;
            }
            await Lugar.create(lugar);
            console.log(`Lugar creado: ${lugar.nombre}`);
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