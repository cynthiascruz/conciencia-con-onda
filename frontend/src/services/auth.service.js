// frontend/src/services/auth.service.js
import { api } from './api'

export const authService = {

  login: (email, password) =>
    api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registro: (nombre, apellido, email, password) =>
    api('/api/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, apellido, email, password }),
    }),

  logout: () =>
    api('/api/auth/logout', {
      method: 'POST',
    }),
}