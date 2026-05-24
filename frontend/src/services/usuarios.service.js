// frontend/src/services/usuarios.service.js
import { api } from './api'

export const usuariosService = {

  // Solo Admin — lista todos los usuarios
  listar: () =>
    api('/api/usuarios'),

  // Solo Admin — cambiar rol de un usuario
  cambiarRol: (id, rol) =>
    api(`/api/usuarios/${id}/rol`, {
      method: 'PATCH',
      body: JSON.stringify({ rol }),
    }),

  // Solo Admin — cambiar estado de un usuario (Activo / Suspendido)
  cambiarEstado: (id, estado) =>
    api(`/api/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),

  // Usuario autenticado — actualizar su propio perfil
  // (el endpoint PUT /api/usuarios/perfil se agrega en el Paso 7)
  actualizarPerfil: (datos) =>
    api('/api/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  // Solo Admin — actualizar datos de un usuario
  actualizarDatos: (id, datos) =>
  api(`/api/usuarios/${id}/datos`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  }),
}