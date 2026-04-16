import { useNavigate } from "react-router-dom"
import logo from "../../../assets/logotipo.svg"
import { Icon, navItems } from "../constants"

const AdminSidebar = ({ seccion, setSeccion, onLogout, pendientesCount }) => {
  const navigate = useNavigate()

  return (
    <aside className="w-56 shrink-0 bg-[#1c16cd]/90 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6 border-b border-white/10">
        <img src={logo} alt="logo" className="w-12 h-12" />
        <span className="font-bold text-white text-md leading-tight">Conciencia<br />con onda</span>
      </div>

      {/* Badge */}
      <div className="px-5 py-3">
        <span className="bg-[#faea1f]/90 text-[#1c16cd]/90 text-[10px] font-bold px-2 py-0.5 rounded-full">
          PANEL DE ADMINISTRADOR
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSeccion(key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left
              ${seccion === key ? "bg-[#f8f8f8] text-[#1c16cd]/90" : "text-white/80 hover:bg-white/20 hover:text-white"}`}
          >
            <Icon name={icon} size={18} />
            {label}
            {key === "pendientes" && pendientesCount > 0 && (
              <span className="ml-auto text-[12px] font-bold px-1.5 py-0.5 rounded-full bg-[#faea1f] text-[#1c16cd]/90">
                {pendientesCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Panel inferior */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1">
        {/* Tarjeta del admin */}
        <div className="bg-white/10 rounded-2xl px-3 py-3 mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#13da28] flex items-center justify-center font-bold text-white text-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-tight truncate">Admin CCO</p>
              <p className="text-white/50 text-[11px] truncate">admin@cco.mx</p>
            </div>
          </div>
        </div>

        {/* Ver sitio */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
        >
          <Icon name="travel_explore" size={18} /> Ver sitio
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
        >
          <Icon name="logout" size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
