// frontend/src/services/lugares.service.js
import { api } from './api'

export const lugaresService = {

  // Público — lista lugares aprobados, acepta query params opcionales
  // Ej: listar({ categoria: 'Museo', q: 'fundidora' })
  listar: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
    ).toString()
    return api(`/api/lugares${query ? `?${query}` : ''}`)
  },

  // Público — detalle de un lugar
  obtener: (id) =>
    api(`/api/lugares/${id}`),

  // Solo Admin — todos los lugares (Pendiente, Aprobado, Rechazado)
  listarAdmin: () =>
    api('/api/lugares/admin/todos'),

  // Usuario autenticado — proponer un nuevo lugar
  proponer: (datos) =>
    api('/api/lugares', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  // Solo Admin — editar datos de un lugar
  editar: (id, datos) =>
    api(`/api/lugares/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    }),

  // Solo Admin — cambiar estado (Pendiente → Aprobado / Rechazado, etc.)
  cambiarEstado: (id, estado) =>
    api(`/api/lugares/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
}