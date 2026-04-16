import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logotipo.svg'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'INICIO',  to: '/'        },
  { label: 'LUGARES', to: '/lugares' },
]

// Obtiene las iniciales del nombre completo
const getIniciales = (nombre = "") =>
  nombre.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")

// Obtiene solo el primer nombre
const getPrimerNombre = (nombre = "") => nombre.trim().split(" ")[0]

const Navbar = () => {
  const { usuario, logout } = useAuth()
  const navigate             = useNavigate()
  const [open, setOpen]      = useState(false)
  const dropdownRef          = useRef(null)

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#1a18cd]/90 backdrop-blur-md px-6 md:px-20 lg:px-32 py-3 transition-all duration-300">
      <div className="max-w-8xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="group flex items-center transition-all">
          <img
            src={logo}
            alt="Conciencia con Onda"
            className="h-10 w-10 md:h-11 md:w-11 group-hover:rotate-12 transition-all duration-500 ease-out"
          />
        </NavLink>

        {/* Navegación */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `text-white font-semibold text-sm tracking-widest relative group transition-all
                  ${isActive ? 'text-[#faeb1f]' : 'hover:text-[#faeb1f]'}`
                }
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#faeb1f] transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Zona derecha */}
        <div className="flex items-center gap-4">
          {usuario ? (
            /* ── Usuario logueado ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-full"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-slate-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {getIniciales(usuario.nombre)}
                </div>
                {/* Nombre */}
                <span className="hidden sm:block text-white font-bold text-sm">
                  {getPrimerNombre(usuario.nombre)}
                </span>
                {/* Chevron */}
                <span
                  className={`material-symbols-rounded text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  style={{ fontSize: "18px" }}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-[tabFade_0.15s_ease]">
                  {/* Info del usuario */}
                  <div className="px-4 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {getIniciales(usuario.nombre)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm leading-tight truncate">{usuario.nombre}</p>
                        <p className="text-slate-400 text-xs truncate">{usuario.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Opciones principales */}
                  <div className="py-1.5">
                    <button
                      onClick={() => { setOpen(false); navigate("/perfil") }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1c16cd] font-medium transition-colors text-left"
                    >
                      <span className="material-symbols-rounded text-slate-400" style={{ fontSize: "18px" }}>person</span>
                      Mi perfil
                    </button>

                    <button
                      onClick={() => { setOpen(false); navigate("/lugares") }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1c16cd] font-medium transition-colors text-left"
                    >
                      <span className="material-symbols-rounded text-slate-400" style={{ fontSize: "18px" }}>location_on</span>
                      Explorar lugares
                    </button>
                  </div>

                  {/* Panel admin — solo para admins */}
                  {(usuario.rol === "Admin" || usuario.rol === "superadmin") && (
                    <div className="border-t border-slate-100 py-1.5">
                      <button
                        onClick={() => { setOpen(false); navigate("/admin") }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#1c16cd] hover:bg-[#1c16cd]/5 transition-colors text-left"
                      >
                        <span className="material-symbols-rounded text-[#1c16cd]" style={{ fontSize: "18px" }}>admin_panel_settings</span>
                        Panel de administrador
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-100 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#d32f2f] hover:bg-red-50 font-medium transition-colors text-left"
                    >
                      <span className="material-symbols-rounded text-[#d32f2f]" style={{ fontSize: "18px" }}>logout</span>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Sin sesión ── */
            <>
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-white font-bold hover:text-[#faeb1f] text-xs tracking-widest transition-all uppercase group leading-none"
              >
                <span className="material-icons-round text-[20px] transition-transform group-hover:-translate-x-1">
                  login
                </span>
                Iniciar Sesión
              </NavLink>

              <NavLink
                to="/registro"
                className="flex items-center gap-2 bg-[#ff8c2a]/90 text-white px-7 py-2.5 rounded-full font-bold text-xs tracking-widest hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase group leading-none border-2 border-transparent focus:border-white/20"
              >
                <span className="material-icons-round text-[20px] group-hover:rotate-12 transition-transform">
                  person_add
                </span>
                Registrarse
              </NavLink>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
