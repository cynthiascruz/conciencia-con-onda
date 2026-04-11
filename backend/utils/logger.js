// Este archivo se encarga de configurar el logger utilizando Winston para registrar eventos y errores en la aplicación.

import winston, { level } from 'winston';
import log from '..models/Log.js';

class MongoTransport extends winston.Transport {
    async log(info, callback) {
        try {
            await log.create({
                level: info.level,
                message: info.message,
                method: info.method || null,
                url: info.url || null,
                statusCode: info.statusCode || null,
            })
        } catch (error) {
            console.error('Error al guardar el log en MongoDB:', error);
        }
        callback()
    }
}

const logger = winston.createLogger({
    level: 'http',
    transports: [
        //log en consola
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        //guarda todos los logs en la BD
        new MongoTransport(),
    ],
});

export default logger;

