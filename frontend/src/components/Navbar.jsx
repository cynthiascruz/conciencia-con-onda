import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logotipo.svg'

const navLinks = [
  { label: 'INICIO',   to: '/'        },
  { label: 'LUGARES',  to: '/lugares' },
  // { label: 'NOTICIAS', to: '/noticias'},
]

const Navbar = () => {
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
                {/* Línea animada debajo */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#faeb1f] transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botones */}
        <div className="flex items-center gap-8">
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
        </div>

      </div>
    </nav>
  )
}

export default Navbar