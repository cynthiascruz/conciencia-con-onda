// frontend/src/services/categorias.service.js
import { api } from './api'

export const categoriasService = {
  listar: () => api('/api/categorias'),
}