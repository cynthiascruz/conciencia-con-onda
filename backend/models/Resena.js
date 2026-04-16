import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
    id_lugar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lugar',
        required: true,
    },
    id_autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    tipo: {
        type: String,
        enum: ['Positiva', 'Negativa'],
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ['Publicada', 'Eliminada', 'Pendiente'],
        default: 'Publicada',
    },
    fecha_Resena: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Resena', resenaSchema);