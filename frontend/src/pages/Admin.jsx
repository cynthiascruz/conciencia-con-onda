import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { kpis, lugaresPendientes as initialPendientes, lugaresAprobados as initialAprobados, usuarios as initialUsuarios } from "../data/admin"
import { reseñas as initialReseñas } from "../data/lugares"
import logo from "../assets/logotipo.svg"

const Icon = ({ name, size = 18 }) => (
  <span className="material-symbols-rounded" style={{ fontSize: `${size}px` }}>{name}</span>
)

const CATEGORIAS = ["Museo", "Parque", "Restaurante", "Cafetería", "Estadio", "Centro Comercial", "Hotel"]
const CATEGORIA_COLORS = {
  "Museo":            "bg-[#7b1fa2]",
  "Parque":           "bg-[#13da28]",
  "Restaurante":      "bg-[#ff8c2a]",
  "Cafetería":        "bg-[#d32f2f]",
  "Estadio":          "bg-[#1c16cd]",
  "Centro Comercial": "bg-[#0097a7]",
  "Hotel":            "bg-[#5d4037]",
}
const TAGS_ACCESIBILIDAD = [
  "Rampa de acceso", "Elevador", "Baño accesible", "Silla de ruedas",
  "Estacionamiento accesible", "Personal capacitado", "Entrada accesible",
  "Menú braille", "Personal LSM", "Senderos accesibles", "Audiolibros",
  "Señalización braille", "Juegos inclusivos", "Habitaciones adaptadas",
  "Transporte accesible", "Espacio amplio",
]

// Sidebar
const navItems = [
  { key: "dashboard",  label: "Dashboard",  icon: "dashboard"  },
  { key: "pendientes", label: "Pendientes", icon: "schedule"   },
  { key: "lugares",    label: "Lugares",    icon: "location_on" },
  { key: "usuarios",   label: "Usuarios",   icon: "group"      },
]

const Sidebar = ({ seccion, setSeccion, onLogout, pendientesCount }) => (
  <aside className="w-56 shrink-0 bg-[#1c16cd]/90 min-h-screen flex flex-col">
    <div className="flex items-center gap-2 px-5 py-6 border-b border-white/10">
      <img src={logo} alt="logo" className="w-12 h-12" />
      <span className="font-bold text-white text-md leading-tight">Conciencia<br />con onda</span>
    </div>
    <div className="px-5 py-3">
      <span className="bg-[#faea1f]/90 text-[#1c16cd]/90 text-[10px] font-bold px-2 py-0.5 rounded-full">
        PANEL DE ADMINISTRADOR
      </span>
    </div>
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
            <span className={`ml-auto text-[12px] font-bold px-1.5 py-0.5 rounded-full
              ${seccion === key ? "bg-[#faea1f] text-[#1c16cd]/90" : "bg-[#faea1f] text-[#1c16cd]/90"}`}>
              {pendientesCount}
            </span>
          )}
        </button>
      ))}
    </nav>
    <div className="p-3 border-t border-white/10">
      <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all w-full">
        <Icon name="logout" size={18} /> Cerrar sesión
      </button>
    </div>
  </aside>
)

// KPIs
const KpiCard = ({ valor, label, color, icon }) => (
  <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex items-center gap-4">
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0`}>
      <Icon name={icon} size={22} />
    </div>
    <div>
      <p className="font-bold text-2xl text-[#171717]">{valor}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  </div>
)

// Dashboard
const Dashboard = ({ setSeccion, pendientesCount }) => (
  <div>
    <h2 className="font-bold text-2xl text-[#171717] mb-1">Dashboard</h2>
    <p className="text-slate-500 text-sm mb-7">Resumen general de la plataforma</p>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <KpiCard valor={pendientesCount}         label="Lugares pendientes" color="bg-[#ff8c2a]/90" icon="error"        />
      <KpiCard valor={kpis.lugaresAprobados}   label="Lugares aprobados"  color="bg-[#13da28]/90" icon="check_circle" />
      <KpiCard valor={kpis.usuariosTotal}      label="Usuarios totales"   color="bg-[#1c16cd]/90" icon="group"        />
      <KpiCard valor={kpis.reseñasTotal}       label="Reseñas publicadas" color="bg-[#7b1fa2]/90" icon="trending_up"  />
    </div>
    {pendientesCount > 0 && (
      <div className="bg-[#fff8e1] border-2 border-[#faea1f] rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#faea1f] rounded-xl flex items-center justify-center text-[#1c16cd]">
            <Icon name="schedule" size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{pendientesCount} lugares esperando aprobación</p>
            <p className="text-slate-500 text-xs">Revísalos para mantener la plataforma actualizada</p>
          </div>
        </div>
        <button onClick={() => setSeccion("pendientes")} className="bg-[#1c16cd]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#1510a0] transition-colors shrink-0">
          Ver pendientes
        </button>
      </div>
    )}
  </div>
)

// Modal lugares
const LugarModal = ({ lugar, onClose, onAprobar, onRechazar }) => {
  const [modoEditar, setModoEditar] = useState(false)
  const [form, setForm] = useState({
    nombre:          lugar.nombre,
    direccion:       lugar.direccion,
    descripcion:     lugar.descripcion,
    categoria:       lugar.categoria,
    imagen:          lugar.imagen,
    horarioResumido: lugar.horarioResumido ?? "",
    sitioWeb:        lugar.sitioWeb ?? "",
    accesibilidad:   [...lugar.accesibilidad],
  })

  // Cerrar con Escape y bloquear scroll
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleTag = (tag) => setForm(f => ({
    ...f,
    accesibilidad: f.accesibilidad.includes(tag)
      ? f.accesibilidad.filter(t => t !== tag)
      : [...f.accesibilidad, tag]
  }))

  const lugarEditado = { ...lugar, ...form, categoriaColor: CATEGORIA_COLORS[form.categoria] }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-[slideUp_0.25s_ease]">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Icon name="close" size={20} />
        </button>

        {/* Scrolleable */}
        <div className="overflow-y-auto flex-1">

          {/* Imagen hero */}
          <div className="relative h-60 md:h-64 overflow-hidden">
            <img
              src={form.imagen}
              alt={form.nombre}
              className="w-full h-full object-cover"
              onError={e => e.target.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`${CATEGORIA_COLORS[form.categoria]} text-white text-[12px] font-semibold px-2 py-1 rounded-full`}>
                  {form.categoria}
                </span>
                <span className="bg-[#ff8c2a] text-white text-[12px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon name="schedule" size={13} /> Pendiente de aprobación
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{form.nombre}</h2>
            </div>
          </div>

          <div className="p-6">

            {/* Solicitado por */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Icon name="person" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-regular">Solicitado por</p>
                <p className="text-sm font-semibold text-slate-700">{lugar.solicitadoPor} · {lugar.fechaSolicitud}</p>
              </div>

              {/* Toggle editar */}
              <button
                onClick={() => setModoEditar(!modoEditar)}
                className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors
                  ${modoEditar
                    ? "bg-[#1c16cd]/90 text-white border-[#1c16cd]/90"
                    : "border-slate-200 text-slate-500 hover:border-[#1c16cd]/90 hover:text-[#1c16cd]/90"
                  }`}
              >
                <Icon name={modoEditar ? "visibility" : "edit"} size={14} />
                {modoEditar ? "Ver info" : "Editar"}
              </button>
            </div>

            {/* Modo vista */}
            {!modoEditar && (
              <>
                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="font-bold text-base text-[#171717] mb-2">Sobre este lugar</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{form.descripcion}</p>
                </div>

                {/* Accesibilidad */}
                <div className="mb-6">
                  <h3 className="font-bold text-base text-[#171717] mb-3">Características de accesibilidad</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {form.accesibilidad.map(feature => (
                      <div key={feature} className="flex items-center gap-2 bg-[#13da28]/10 text-[#0a8a1a] px-3 py-2 rounded-xl">
                        <Icon name="check_circle" size={14} />
                        <span className="text-xs font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información */}
                <div className="mb-6">
                  <h3 className="font-bold text-base text-[#171717] mb-3">Información</h3>
                  <div className="space-y-3">

                    {/* Dirección */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1c16cd]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-rounded text-[#1c16cd]" style={{ fontSize: "18px" }}>location_on</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Dirección</p>
                        <p className="text-sm font-semibold text-slate-700">{form.direccion}</p>
                      </div>
                    </div>

                    {/* Horario */}
                    {form.horarioResumido && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#ff8c2a]/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-rounded text-[#ff8c2a]" style={{ fontSize: "18px" }}>schedule</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Horario</p>
                          <p className="text-sm font-semibold text-slate-700">{form.horarioResumido}</p>
                        </div>
                      </div>
                    )}

                    {/* Sitio web */}
                    {form.sitioWeb && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#7b1fa2]/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-rounded text-[#7b1fa2]" style={{ fontSize: "18px" }}>language</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Sitio web</p>
                          <a
                            href={form.sitioWeb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[#1c16cd] hover:underline"
                          >
                            Visitar sitio web
                          </a>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </>
            )}

            {/* Modo editar */}
            {modoEditar && (
              <div className="flex flex-col gap-5">

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Nombre del lugar</label>
                  <input
                    value={form.nombre}
                    onChange={e => set("nombre", e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2 tracking-wide">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map(cat => (
                      <button
                        key={cat}
                        onClick={() => set("categoria", cat)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors
                          ${form.categoria === cat
                            ? `${CATEGORIA_COLORS[cat]} text-white border-transparent`
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Dirección</label>
                  <input
                    value={form.direccion}
                    onChange={e => set("direccion", e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={e => set("descripcion", e.target.value)}
                    rows={3}
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">URL de imagen</label>
                  <input
                    value={form.imagen}
                    onChange={e => set("imagen", e.target.value)}
                    placeholder="https://..."
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Horario</label>
                    <input
                      value={form.horarioResumido}
                      onChange={e => set("horarioResumido", e.target.value)}
                      placeholder="Lun-Vie 9:00 - 18:00"
                      className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Sitio web</label>
                    <input
                      value={form.sitioWeb}
                      onChange={e => set("sitioWeb", e.target.value)}
                      placeholder="https://..."
                      className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2 tracking-wide">
                    Características de accesibilidad
                    <span className="ml-2 normal-case text-xs font-medium text-slate-400">({form.accesibilidad.length} seleccionadas)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS_ACCESIBILIDAD.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-colors flex items-center gap-1
                          ${form.accesibilidad.includes(tag)
                            ? "bg-[#13da28]/15 border-[#13da28] text-[#0a8a1a]"
                            : "border-slate-200 text-slate-400 hover:border-slate-300"
                          }`}
                      >
                        {form.accesibilidad.includes(tag) && <Icon name="check" size={12} />}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Footer acciones */}
        <div className="p-5 border-t border-slate-100 flex gap-3 bg-white shrink-0">
          <button
            onClick={() => { onRechazar(lugar._id); onClose() }}
            className="flex items-center justify-center gap-2 border-2 border-[#d32f2f]/40 text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white font-bold py-3 px-5 rounded-2xl text-sm transition-colors"
          >
            <Icon name="cancel" size={16} /> Rechazar
          </button>
          <button
            onClick={() => { onAprobar(lugarEditado); onClose() }}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1c16cd]/90 hover:bg-[#1510a0] text-white font-bold py-3 rounded-2xl text-sm transition-colors"
          >
            <Icon name="check_circle" size={16} />
            {modoEditar ? "Aprobar con cambios" : "Aprobar"}
          </button>
        </div>

      </div>
    </div>
  )
}

// Pendientes
const Pendientes = ({ onCountChange }) => {
  const [pendientes, setPendientes] = useState(initialPendientes)
  const [lugarVisto, setLugarVisto] = useState(null)

  const aprobar = (lugar) => {
    const next = pendientes.filter(l => l._id !== lugar._id)
    setPendientes(next)
    onCountChange(next.length)
  }
  const rechazar = (id) => {
    const next = pendientes.filter(l => l._id !== id)
    setPendientes(next)
    onCountChange(next.length)
  }

  return (
    <div>
      <h2 className="font-extrabold text-2xl text-slate-900 mb-1">Lugares pendientes</h2>
      <p className="text-slate-400 text-sm mb-7">Revisa, edita y aprueba o rechaza los lugares enviados por la comunidad</p>

      {pendientes.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-slate-100 p-16 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-black text-slate-700">Todo al día</p>
          <p className="text-slate-400 text-sm mt-1">No hay lugares pendientes de revisión</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pendientes.map(lugar => (
            <div
              key={lugar._id}
              onClick={() => setLugarVisto(lugar)}
              className="cursor-pointer bg-white rounded-2xl border-2 border-slate-100 overflow-hidden hover:border-[#1c16cd]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {/* Imagen */}
              <div className="relative h-36 overflow-hidden">
                <img src={lugar.imagen} alt={lugar.nombre} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-3 left-3 ${lugar.categoriaColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                  {lugar.categoria}
                </span>
                <span className="absolute top-3 right-3 bg-[#ff8c2a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Icon name="schedule" size={11} /> Pendiente
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-extrabold text-slate-900 text-sm mb-1">{lugar.nombre}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <Icon name="location_on" size={12} />
                  <span className="truncate">{lugar.direccion}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Por <span className="font-semibold text-slate-600">{lugar.solicitadoPor}</span> · {lugar.fechaSolicitud}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lugar.accesibilidad.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-[#13da28]/10 text-[#0a8a1a] text-[10px] font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                  {lugar.accesibilidad.length > 2 && (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">+{lugar.accesibilidad.length - 2} más</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lugarVisto && (
        <LugarModal
          lugar={lugarVisto}
          onClose={() => setLugarVisto(null)}
          onAprobar={aprobar}
          onRechazar={rechazar}
        />
      )}
    </div>
  )
}

// Modal usuario
const UsuarioModal = ({ usuario, onClose, onGuardar }) => {
  const [form, setForm] = useState({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="bg-[#1c16cd]/90 px-6 py-5 flex items-center gap-4">
          <div>
            <p className="font-bold text-white text-base">{usuario.nombre}</p>
            <p className="text-white/60 text-xs">{usuario.email}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold transition-colors">×</button>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100">
          {[
            { label: "Lugares",  valor: usuario.lugaresPublicados, small: false },
            { label: "Reseñas",  valor: usuario.reseñas,           small: false },
            { label: "Registro", valor: usuario.fechaRegistro,     small: false  },
          ].map(({ label, valor, small }) => (
            <div key={label} className="flex flex-col items-center py-4 gap-1 border-r border-slate-100 last:border-0">
              <p className={`font-bold text-slate-900 ${small ? "text-xs" : "text-lg"}`}>{valor}</p>
              <p className="text-[10px] text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Nombre</label>
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#171717] mb-1.5 tracking-wide">Email</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#171717] mb-2 tracking-wide">Rol</label>
            <div className="flex gap-2">
              {["usuario", "admin"].map(rol => (
                <button key={rol} onClick={() => setForm(f => ({ ...f, rol }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors
                    ${form.rol === rol
                      ? rol === "admin" ? "bg-[#ff8c2a]/90 text-white border-[#ff8c2a]/90" : "bg-[#ff8c2a]/90 text-white border-[#ff8c2a]/90"
                      : "border-slate-200 text-slate-400 hover:border-slate-300"}`}>
                  {rol === "admin" ? "Administrador" : "Usuario"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => { onGuardar({ ...usuario, ...form }); onClose() }}
            className="w-full bg-[#1c16cd]/90 hover:bg-[#1510a0] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

// Usuarios
const Usuarios = () => {
  const [usuarios, setUsuarios]               = useState(initialUsuarios)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [query, setQuery]                     = useState("")

  const toggleEstado   = (id) =>
    setUsuarios(us => us.map(u => u._id === id ? { ...u, estado: u.estado === "activo" ? "suspendido" : "activo" } : u))
  const guardarUsuario = (actualizado) =>
    setUsuarios(us => us.map(u => u._id === actualizado._id ? actualizado : u))

  const usuariosFiltrados = usuarios.filter(u => {
    const q = query.toLowerCase()
    return u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  return (
    <div>
      <h2 className="font-extrabold text-2xl text-[#171717] mb-1">Usuarios</h2>
      <p className="text-slate-400 text-sm mb-6">Gestiona los usuarios registrados en la plataforma</p>

      {/* Searchbar */}
      <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl px-4 gap-3 mb-6 focus-within:border-[#1c16cd]/90 transition-colors">
        <span className="material-symbols-rounded text-slate-400" style={{ fontSize: "20px" }}>search</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="flex-1 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {usuariosFiltrados.map(usuario => {
          const esAdmin   = usuario.rol === "admin"
          const esActivo  = usuario.estado === "activo"

          return (
            <div key={usuario._id} className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden hover:shadow-md transition-shadow">

              {/* Header con avatar y estado */}
              <div className="flex items-center gap-4 p-5 border-b border-slate-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 text-sm truncate">{usuario.nombre}</p>
                    {esAdmin && (
                      <span className="bg-[#1c16cd]/10 text-[#1c16cd]/90 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        Administrador
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{usuario.email}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full
                  ${esActivo ? "bg-[#13da28]/10 text-[#0a8a1a]" : "bg-[#d32f2f]/10 text-[#d32f2f]"}`}>
                  {usuario.estado}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <p className="font-bold text-slate-900 text-sm">{usuario.lugaresPublicados}</p>
                  <p className="text-[10px] text-slate-400">Lugares</p>
                </div>
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <p className="font-bold text-slate-900 text-sm">{usuario.reseñas}</p>
                  <p className="text-[10px] text-slate-400">Reseñas</p>
                </div>
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <p className="font-bold text-slate-900 text-[10px] text-center leading-tight">{usuario.fechaRegistro}</p>
                  <p className="text-[10px] text-slate-400">Registro</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 p-4">
                <button
                  onClick={() => setUsuarioEditando(usuario)}
                  className="flex-1 flex items-center justify-center gap-1.5 border-2 border-slate-200 hover:border-[#1c16cd] text-slate-500 hover:text-[#1c16cd]/90 font-bold text-xs py-2 rounded-xl transition-colors"
                >
                  <Icon name="edit" size={14} /> Editar
                </button>
                {!esAdmin && (
                  <button
                    onClick={() => toggleEstado(usuario._id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-xs py-2 rounded-xl border-2 transition-colors
                      ${esActivo
                        ? "border-[#d32f2f]/30 text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f]"
                        : "border-[#13da28]/30 text-[#0a8a1a] hover:bg-[#13da28] hover:text-white hover:border-[#13da28]"
                      }`}
                  >
                    <Icon name={esActivo ? "block" : "check_circle"} size={14} />
                    {esActivo ? "Suspender" : "Activar"}
                  </button>
                )}
                {esAdmin && (
                  <div className="flex-1 flex items-center justify-center gap-1.5 text-slate-300 text-xs font-medium">
                    <Icon name="shield" size={14} /> Protegido
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>

      {usuarioEditando && (
        <UsuarioModal
          usuario={usuarioEditando}
          onClose={() => setUsuarioEditando(null)}
          onGuardar={guardarUsuario}
        />
      )}
    </div>
  )
}

// Modal lugar activo (editar / desactivar / reseñas)
const LugarActivoModal = ({ lugar, onClose, onGuardar, onToggleActivo, reseñasDelLugar = [], onBorrarReseña }) => {
  const [tab, setTab]   = useState("editar")
  const [form, setForm] = useState({
    nombre:          lugar.nombre,
    direccion:       lugar.direccion,
    descripcion:     lugar.descripcion,
    categoria:       lugar.categoria,
    imagen:          lugar.imagen,
    horarioResumido: lugar.horarioResumido ?? "",
    sitioWeb:        lugar.sitioWeb ?? "",
    accesibilidad:   [...lugar.accesibilidad],
  })

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleTag = (tag) => setForm(f => ({
    ...f,
    accesibilidad: f.accesibilidad.includes(tag)
      ? f.accesibilidad.filter(t => t !== tag)
      : [...f.accesibilidad, tag]
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-[slideUp_0.25s_ease]">

        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
          <Icon name="close" size={20} />
        </button>

        {/* Hero */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <img src={form.imagen} alt={form.nombre} className="w-full h-full object-cover"
            onError={e => e.target.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600"} />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`${CATEGORIA_COLORS[form.categoria] ?? "bg-slate-500"} text-white text-[12px] font-semibold px-2 py-1 rounded-full`}>
                {form.categoria}
              </span>
              {lugar.verificado && (
                <span className="bg-[#13da28] text-white text-[12px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon name="check_circle" size={13} /> Verificado
                </span>
              )}
              {!lugar.activo && (
                <span className="bg-slate-500 text-white text-[12px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon name="block" size={13} /> Desactivado
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{form.nombre}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0">
          {[
            { key: "editar",  label: "Editar",  icon: "edit"         },
            { key: "reseñas", label: `Reseñas${reseñasDelLugar.length > 0 ? ` (${reseñasDelLugar.length})` : ""}`, icon: "chat_bubble" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 -mb-px transition-colors
                ${tab === t.key
                  ? "text-[#1c16cd]/90 border-[#1c16cd]/90"
                  : "text-slate-400 border-transparent hover:text-slate-600"}`}
            >
              <Icon name={t.icon} size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1">

          {/* ─── Tab Editar ─── */}
          {tab === "editar" && (
            <div className="p-6 flex flex-col gap-6">

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-1.5">Nombre del lugar</label>
                <input value={form.nombre} onChange={e => set("nombre", e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIAS.map(cat => (
                    <button key={cat} onClick={() => set("categoria", cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors
                        ${form.categoria === cat
                          ? `${CATEGORIA_COLORS[cat]} text-white border-transparent`
                          : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-1.5">Dirección</label>
                <input value={form.direccion} onChange={e => set("direccion", e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-1.5">Descripción</label>
                <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} rows={3}
                  className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-1.5">URL de imagen</label>
                <input value={form.imagen} onChange={e => set("imagen", e.target.value)} placeholder="https://..."
                  className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5">Horario</label>
                  <input value={form.horarioResumido} onChange={e => set("horarioResumido", e.target.value)} placeholder="Lun-Vie 9:00 - 18:00"
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-1.5">Sitio web</label>
                  <input value={form.sitioWeb} onChange={e => set("sitioWeb", e.target.value)} placeholder="https://..."
                    className="w-full border-2 border-slate-200 focus:border-[#1c16cd]/90 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2">
                  Características de accesibilidad
                  <span className="ml-2 text-xs font-medium text-slate-400">({form.accesibilidad.length} seleccionadas)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS_ACCESIBILIDAD.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-colors flex items-center gap-1
                        ${form.accesibilidad.includes(tag)
                          ? "bg-[#13da28]/15 border-[#13da28] text-[#0a8a1a]"
                          : "border-slate-200 text-slate-400 hover:border-slate-300"}`}>
                      {form.accesibilidad.includes(tag) && <Icon name="check" size={12} />}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ─── Tab Reseñas ─── */}
          {tab === "reseñas" && (
            <div className="p-6">
              {reseñasDelLugar.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="chat_bubble" size={40} />
                  <p className="font-bold text-slate-500 mt-3">Sin reseñas todavía</p>
                  <p className="text-slate-400 text-sm mt-1">Este lugar aún no tiene comentarios de usuarios</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reseñasDelLugar.map(r => (
                    <div key={r._id} className="flex gap-3 items-start bg-slate-50 rounded-2xl px-4 py-3">
                      <span
                        className={`material-symbols-rounded shrink-0 mt-0.5 ${r.tipo === "positiva" ? "text-[#13da28]" : "text-[#d32f2f]"}`}
                        style={{ fontSize: "20px" }}
                      >
                        {r.tipo === "positiva" ? "sentiment_excited" : "sentiment_stressed"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-700">{r.usuarioNombre}</span>
                          <span className="text-xs text-slate-400">{r.fecha}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{r.texto}</p>
                      </div>
                      <button
                        onClick={() => onBorrarReseña(r._id)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-[#d32f2f]/10 hover:text-[#d32f2f] transition-colors"
                        title="Eliminar reseña"
                      >
                        <Icon name="delete" size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer — solo en tab editar */}
        {tab === "editar" && (
          <div className="p-5 border-t border-slate-100 flex gap-3 bg-white shrink-0">
            <button
              onClick={() => { onToggleActivo(lugar._id); onClose() }}
              className={`flex items-center justify-center gap-2 border-2 font-bold py-3 px-5 rounded-2xl text-sm transition-colors
                ${lugar.activo
                  ? "border-slate-300 text-slate-500 hover:bg-slate-100"
                  : "border-[#13da28]/40 text-[#0a8a1a] hover:bg-[#13da28] hover:text-white hover:border-[#13da28]"}`}
            >
              <Icon name={lugar.activo ? "block" : "check_circle"} size={16} />
              {lugar.activo ? "Desactivar" : "Activar"}
            </button>
            <button
              onClick={() => { onGuardar({ ...lugar, ...form, categoriaColor: CATEGORIA_COLORS[form.categoria] }); onClose() }}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1c16cd]/90 hover:bg-[#1510a0] text-white font-bold py-3 rounded-2xl text-sm transition-colors"
            >
              <Icon name="save" size={16} /> Guardar cambios
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// Lugares activos
const LugaresActivos = () => {
  const [lugares, setLugares]     = useState(initialAprobados)
  const [reseñas, setReseñas]     = useState(initialReseñas)
  const [lugarEditando, setLugar] = useState(null)
  const [query, setQuery]         = useState("")
  const [filtroActivo, setFiltro] = useState("todos") // "todos" | "activos" | "inactivos"

  const guardar      = (actualizado) => setLugares(ls => ls.map(l => l._id === actualizado._id ? actualizado : l))
  const toggleActivo = (id)          => setLugares(ls => ls.map(l => l._id === id ? { ...l, activo: !l.activo } : l))
  const borrarReseña = (id)          => setReseñas(rs => rs.filter(r => r._id !== id))

  const filtrados = lugares.filter(l => {
    const q   = query.toLowerCase()
    const ok  = l.nombre.toLowerCase().includes(q) || l.categoria.toLowerCase().includes(q) || l.direccion.toLowerCase().includes(q)
    const est = filtroActivo === "todos" ? true : filtroActivo === "activos" ? l.activo : !l.activo
    return ok && est
  })

  return (
    <div>
      <h2 className="font-extrabold text-2xl text-[#171717] mb-1">Lugares</h2>
      <p className="text-slate-400 text-sm mb-6">Gestiona todos los lugares aprobados en la plataforma</p>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Searchbar */}
        <div className="flex-1 flex items-center bg-white border-2 border-slate-200 rounded-2xl px-4 gap-3 focus-within:border-[#1c16cd]/90 transition-colors">
          <span className="material-symbols-rounded text-slate-400" style={{ fontSize: "20px" }}>search</span>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, categoría o dirección..."
            className="flex-1 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent" />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
            </button>
          )}
        </div>

        {/* Filtro activo/inactivo */}
        <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl px-3 py-1.5">
          {[
            { key: "todos",     label: "Todos"    },
            { key: "activos",   label: "Activos"  },
            { key: "inactivos", label: "Inactivos" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFiltro(key)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors
                ${filtroActivo === key
                  ? "bg-[#1c16cd]/90 text-white"
                  : "text-slate-500 hover:bg-slate-100"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-slate-100 p-16 text-center">
          <Icon name="search_off" size={40} />
          <p className="font-bold text-slate-700 mt-3">Sin resultados</p>
          <p className="text-slate-400 text-sm mt-1">Intenta con otros términos o filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map(lugar => (
            <div key={lugar._id}
              onClick={() => setLugar(lugar)}
              className={`cursor-pointer bg-white rounded-2xl border-2 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all
                ${lugar.activo ? "border-slate-100 hover:border-[#1c16cd]/30" : "border-slate-200 opacity-60 hover:opacity-80"}`}
            >
              {/* Imagen */}
              <div className="relative h-36 overflow-hidden">
                <img src={lugar.imagen} alt={lugar.nombre} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <span className={`absolute top-3 left-3 ${lugar.categoriaColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                  {lugar.categoria}
                </span>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {lugar.verificado && (
                    <span className="bg-[#13da28] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Icon name="verified" size={10} />
                    </span>
                  )}
                  {!lugar.activo && (
                    <span className="bg-slate-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-bold text-slate-900 text-sm mb-1 truncate">{lugar.nombre}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <Icon name="location_on" size={12} />
                  <span className="truncate">{lugar.direccion}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                  <Icon name="schedule" size={12} />
                  <span>{lugar.horarioResumido}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="flex items-center gap-1 bg-[#13da28]/10 text-[#0a8a1a] text-[10px] font-bold px-2 py-1 rounded-full">
                    <Icon name="sentiment_excited" size={11} /> {lugar.reseñasCount.positivas}
                  </span>
                  <span className="flex items-center gap-1 bg-[#d32f2f]/10 text-[#d32f2f] text-[10px] font-bold px-2 py-1 rounded-full">
                    <Icon name="sentiment_stressed" size={11} /> {lugar.reseñasCount.negativas}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lugarEditando && (
        <LugarActivoModal
          lugar={lugarEditando}
          onClose={() => setLugar(null)}
          onGuardar={guardar}
          onToggleActivo={toggleActivo}
          reseñasDelLugar={reseñas.filter(r => r.lugarId === lugarEditando._id)}
          onBorrarReseña={borrarReseña}
        />
      )}
    </div>
  )
}

// Admin principal
const Admin = () => {
  const navigate                              = useNavigate()
  const [seccion, setSeccion]                 = useState("dashboard")
  const [pendientesCount, setPendientesCount] = useState(initialPendientes.length)

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar seccion={seccion} setSeccion={setSeccion} onLogout={() => navigate("/login")} pendientesCount={pendientesCount} />
      <main className="flex-1 px-8 py-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-slate-400 font-regular">Panel de administración</p>
            <p className="font-extrabold text-slate-900 text-sm">Bienvenido, Admin</p>
          </div>
        </div>
        {seccion === "dashboard"  && <Dashboard setSeccion={setSeccion} pendientesCount={pendientesCount} />}
        {seccion === "pendientes" && <Pendientes onCountChange={setPendientesCount} />}
        {seccion === "lugares"    && <LugaresActivos />}
        {seccion === "usuarios"   && <Usuarios />}
      </main>
    </div>
  )
}

export default Admin