import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    apellido:{
        type: String,
        required: true,
    },
    correo:{
        type: String,
        required: true,
        unique: true
    }, 
    password:{
        type: String,
        required: true,
    },
    rol:{
        type: String,
        enum: ['Admin', 'Usuario'],
        default: 'Usuario',
    },
    estado:{
        type: String,
        enum: ['Activo', 'Suspendido','Protegido'],
        default: 'Activo',
    },
    fecha_Registro:{
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('Usuario', usuarioSchema);