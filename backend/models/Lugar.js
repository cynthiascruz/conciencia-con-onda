import mongoose from "mongoose";

const lugarSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true  
    },
    direccion: {
        type: String,
        required: true,
    },
    horario: {
        type: String,
        required: optional,
    },
    descripcion: {
        type: String,
        required: true,
    },
    url_img: {
        type: String,
        required: optional,
    },
    url_sitioweb: {
        type: String,
        required: optional,
    },
    caracteristicas_accesibilidad: [{
    type: String,
    enum: [
      'rampa de acceso', 'elevador', 'baño accesible', 'silla de ruedas',
      'estacionamiento accesible', 'personal capacitado', 'entrada accesible',
      'menú braille', 'personal LSM', 'senderos accesibles', 'audiolibros',
      'señalización braille', 'juegos inclusivos', 'transporte accesible', 'espacio amplio'
        ],
    }],
    estado: {
        type: String,
        enum: ['Pendiente', 'Aprobado','Inactivo', 'Rechazado'],
        default: 'Pendiente',
    },
    creadoPor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    
})

export default mongoose.model('Lugar', lugarSchema);
    