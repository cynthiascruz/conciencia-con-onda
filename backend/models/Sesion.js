import mongoose from 'mongoose';

const sesionSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    fechaCreacion:{
        type: Date,
        default: Date.now,
    },
    fechaExpiracion: {
        type: Date,
        required: true,
    },
    activa: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model('Sesion', sesionSchema);