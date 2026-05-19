// frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL

/*
    Wrapper sobre fetch que:
  - Prepone la URL base del backend
  - Siempre envía las cookies (credentials: 'include')
  - Parsea la respuesta como JSON
  - Lanza un error con el mensaje del servidor si el status no es ok
 */
export const api = async (endpoint, options = {}) => {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    // Lanzamos el mensaje del servidor para que el componente lo muestre en el toast
    const error = new Error(data.mensaje || 'Error en la solicitud')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}