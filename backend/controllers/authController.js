// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import Sesion from '../models/Sesion.js'
import logger from '../utils/logger.js'

/* 
    Registro de usuario
    Método: POST 
    Ruta: /api/auth/registro
*/

export const registro = async (req, res) => {
    const { nombre, apellido, email, password } = req.body
    try {
        const existe = await Usuario.findOne({ email })
        if (existe) {
            logger.warn('Intento de registro con email ya existente', {
                method: req.method, url: req.originalUrl, statusCode: 400,
            })
            return res.status(400).json({ mensaje: 'El email ya está registrado.' })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const usuario = await Usuario.create({
            nombre,
            apellido,
            email,
            password: passwordHash,
        })

        logger.info(`Usuario registrado: ${usuario.email}`, {
            method: req.method, url: req.originalUrl, statusCode: 201,
        })

        return res.status(201).json({ mensaje: 'Usuario registrado correctamente.' })

    } catch (error) {
        logger.error(`Error en registro: ${error.message}`, {
            method: req.method, url: req.originalUrl, statusCode: 500,
        })
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

/* 
    Login de usuario
    Método: POST
    Ruta: /api/auth/login
*/

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            logger.warn('Intento de login con email no registrado', {
                method: req.method, url: req.originalUrl, statusCode: 401,
            })
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' })
        }

        if (usuario.estado !== 'Activo') {
            logger.warn(`Login denegado — cuenta ${usuario.estado}: ${usuario.email}`, {
                method: req.method, url: req.originalUrl, statusCode: 403,
            })
            return res.status(403).json({ mensaje: 'Tu cuenta está suspendida. Contacta al administrador.' })
        }

        const passwordValida = await bcrypt.compare(password, usuario.password)
        if (!passwordValida) {
            logger.warn(`Contraseña incorrecta para: ${usuario.email}`, {
                method: req.method, url: req.originalUrl, statusCode: 401,
            })
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' })
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        )

        const expiracion = new Date(Date.now() + 8 * 60 * 60 * 1000)
        await Sesion.create({
            usuario_id: usuario._id,
            token,
            fechaExpiracion: expiracion,
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000,
        })

        logger.info(`Login exitoso: ${usuario.email}`, {
            method: req.method, url: req.originalUrl, statusCode: 200,
        })

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso.',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
            },
        })

    } catch (error) {
        logger.error(`Error en login: ${error.message}`, {
            method: req.method, url: req.originalUrl, statusCode: 500,
        })
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

/* 
    Logout de usuario
    Método: POST
    Ruta: /api/auth/logout
*/

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.token

        if (token) {
            await Sesion.findOneAndUpdate({ token }, { activa: false })
        }

        res.clearCookie('token')

        logger.info('Logout exitoso', {
            method: req.method, url: req.originalUrl, statusCode: 200,
        })

        return res.status(200).json({ mensaje: 'Sesión cerrada correctamente.' })

    } catch (error) {
        logger.error(`Error en logout: ${error.message}`, {
            method: req.method, url: req.originalUrl, statusCode: 500,
        })
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}