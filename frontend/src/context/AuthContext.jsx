import { createContext, useContext, useState, useCallback } from "react"

const AuthContext = createContext(null)

const LS_KEY = "usuario"

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((data) => {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
    setUsuario(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setUsuario(null)
  }, [])

  const actualizarPerfil = useCallback((datos) => {
    setUsuario(prev => {
      const actualizado = { ...prev, ...datos }
      localStorage.setItem(LS_KEY, JSON.stringify(actualizado))
      return actualizado
    })
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
