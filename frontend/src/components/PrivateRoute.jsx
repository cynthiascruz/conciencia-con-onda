// frontend/src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente guardián de rutas.
 * 
 * Sin prop `rol`  → solo requiere sesión activa
 * Con prop `rol`  → requiere sesión activa + ese rol específico
 * 
 * Uso en App.jsx:
 *   <Route element={<PrivateRoute />}>           ← solo sesión
 *   <Route element={<PrivateRoute rol="Admin" />}> ← sesión + Admin
 */
const PrivateRoute = ({ rol }) => {
  const { usuario } = useAuth()

  // Sin sesión → redirige al login
  if (!usuario) return <Navigate to="/login" replace />

  // Con sesión pero sin el rol requerido → redirige al inicio
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />

  // Todo ok → renderiza la ruta hija
  return <Outlet />
}

export default PrivateRoute