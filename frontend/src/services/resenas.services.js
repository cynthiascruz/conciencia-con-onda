// frontend/src/services/resenas.service.js
import { api } from './api'

export const resenasService = {

  // Público — reseñas publicadas de un lugar
  listarPorLugar: (lugarId) =>
    api(`/api/resenas/${lugarId}`),

  // Solo Admin — reseñas (publicadas y pendientes) de un lugar
  listarAdminPorLugar: (lugarId) =>
    api(`/api/resenas/${lugarId}/admin`),

  // Usuario autenticado — crear reseña
  crear: (id_lugar, tipo, descripcion) =>
    api('/api/resenas', {
      method: 'POST',
      body: JSON.stringify({ id_lugar, tipo, descripcion }),
    }),

  // Solo Admin — cambiar estado de una reseña
  cambiarEstado: (id, estado) =>
    api(`/api/resenas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
}