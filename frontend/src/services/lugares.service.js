// frontend/src/services/lugares.service.js
import { api } from './api'

// ─── Colores por categoría (espejo del diseño) ────────────────────────────────
const CATEGORIA_COLORS = {
  'Museo':            'bg-[#7b1fa2]',
  'Parque':           'bg-[#13da28]',
  'Restaurante':      'bg-[#ff8c2a]',
  'Cafetería':        'bg-[#d32f2f]',
  'Estadio':          'bg-[#1c16cd]',
  'Centro Comercial': 'bg-[#0097a7]',
  'Hotel':            'bg-[#5d4037]',
}

// Mayusculiza la primera letra
const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/*
  Funcioón para adapatar la respuesta del backend al formato de los componentes.
 */
export const adaptarLugar = (lugar) => ({
  _id:             lugar._id,
  nombre:          lugar.nombre,
  categoria:       lugar.categoria?.nombre ?? '',
  categoriaId:     lugar.categoria?._id   ?? '',
  categoriaColor:  CATEGORIA_COLORS[lugar.categoria?.nombre] ?? 'bg-slate-400',
  direccion:       lugar.direccion,
  descripcion:     lugar.descripcion,
  imagen:          lugar.url_img      ?? 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
  horarioResumido: lugar.horario      ?? '—',
  sitioWeb:        lugar.url_sitioweb ?? null,
  accesibilidad:   (lugar.caracteristicas_accesibilidad ?? []).map(cap),
  verificado:      true,                          // el endpoint público solo devuelve Aprobados
  reseñasCount:    { positivas: 0, negativas: 0 }, // se poblan al abrir el modal
  estado:          lugar.estado,
})


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