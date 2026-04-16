import { useState, useMemo, useCallback, memo } from "react"
import { usuarios as initialUsuarios } from "../../../data/admin"
import { Icon } from "../constants"

// ─── Configuración de roles ───────────────────────────────────────────────────
const ROLES = [
  { value: "todos",       label: "Todos"              },
  { value: "superadmin",  label: "Superadministrador" },
  { value: "admin",       label: "Administrador"      },
  { value: "usuario",     label: "Usuario"            },
]

const rolBadge = {
  superadmin: { label: "Superadmin",    icon: "admin_panel_settings", bg: "bg-purple-100",   text: "text-purple-700" },
  admin:      { label: "Administrador", icon: "manage_accounts",      bg: "bg-[#1c16cd]/10", text: "text-[#1c16cd]"  },
  usuario:    { label: "Usuario",       icon: "person",               bg: "bg-slate-100",    text: "text-slate-500"  },
}

const ESTADOS = [
  { value: "todos",      label: "Todos"    },
  { value: "activo",     label: "Activo"   },
  { value: "suspendido", label: "Inactivo" },
]

const SORT_OPTIONS = [
  { value: "fecha",  label: "Fecha de registro" },
  { value: "nombre", label: "Nombre"            },
]

const PER_PAGE = 8

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })

// ─── Sub-componente memoizado para botón de rol ──────────────────────────────
const RolButton = memo(({ value, label, icon, active, onSelect }) => (
  <button
    onClick={() => onSelect(value)}
    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
      ${active
        ? "bg-[#1c16cd] text-white border-[#1c16cd] shadow-sm shadow-[#1c16cd]/20"
        : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}
  >
    <Icon name={icon} size={15} />
    {label}
  </button>
))

// ─── Modal de edición ────────────────────────────────────────────────────────
const inputClass = "w-full border-2 border-slate-200 focus:border-[#1c16cd]/70 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"

const UsuarioModal = memo(({ usuario, onClose, onGuardar }) => {
  const [form, setForm] = useState({
    nombre:   usuario.nombre,
    email:    usuario.email,
    password: "",
    rol:      usuario.rol,
  })
  const [showPassword, setShowPassword] = useState(false)
  const isSuperadmin = usuario.rol === "superadmin"

  const setNombre   = useCallback(e => setForm(f => ({ ...f, nombre:   e.target.value })), [])
  const setEmail    = useCallback(e => setForm(f => ({ ...f, email:    e.target.value })), [])
  const setPassword = useCallback(e => setForm(f => ({ ...f, password: e.target.value })), [])
  const togglePass  = useCallback(() => setShowPassword(v => !v), [])
  const setRol      = useCallback(rol => setForm(f => ({ ...f, rol })), [])
  const handleGuardar = useCallback(() => { onGuardar({ ...usuario, ...form }); onClose() }, [form, usuario, onGuardar, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c16cd] to-[#3730d4] px-6 py-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0 ring-2 ring-white/20">
            {usuario.iniciales}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-[15px] leading-tight truncate">{usuario.nombre}</p>
            <p className="text-white/55 text-xs truncate mt-0.5">{usuario.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors shrink-0"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
          {[
            { label: "Rol",      valor: rolBadge[usuario.rol]?.label ?? "Usuario" },
            { label: "Estado",   valor: usuario.estado === "activo" ? "Activo" : "Inactivo" },
            { label: "Registro", valor: formatFecha(usuario.fechaRegistro) },
          ].map(({ label, valor }) => (
            <div key={label} className="flex flex-col items-center py-3.5 gap-0.5 border-r border-slate-200 last:border-0">
              <p className="font-bold text-slate-700 text-xs leading-snug text-center">{valor}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div className="p-6 flex flex-col gap-4">
          {isSuperadmin ? (
            <div className="flex items-center gap-3 bg-purple-50 border-2 border-purple-100 rounded-2xl px-4 py-3.5 text-purple-600">
              <Icon name="admin_panel_settings" size={20} />
              <div>
                <p className="font-bold text-sm">Cuenta protegida</p>
                <p className="text-xs text-purple-400 mt-0.5">El superadministrador no puede modificarse desde aquí</p>
              </div>
            </div>
          ) : (
            <>
              {/* Nombre */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Nombre completo</label>
                <input
                  value={form.nombre}
                  onChange={setNombre}
                  placeholder="Nombre del usuario"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={setEmail}
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nueva contraseña
                  <span className="ml-1.5 normal-case font-normal text-slate-300">(dejar vacío para no cambiar)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={togglePass}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Icon name={showPassword ? "visibility_off" : "visibility"} size={17} />
                  </button>
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Rol</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "usuario", label: "Usuario",       icon: "person"          },
                    { value: "admin",   label: "Administrador", icon: "manage_accounts" },
                  ].map(({ value, label, icon }) => (
                    <RolButton
                      key={value}
                      value={value}
                      label={label}
                      icon={icon}
                      active={form.rol === value}
                      onSelect={setRol}
                    />
                  ))}
                </div>
              </div>

              {/* Guardar */}
              <button
                onClick={handleGuardar}
                className="w-full bg-[#1c16cd] hover:bg-[#1510a0] active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all mt-1 shadow-sm shadow-[#1c16cd]/30"
              >
                Guardar cambios
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

// ─── Componente principal ─────────────────────────────────────────────────────
const Usuarios = () => {
  const [usuarios, setUsuarios]             = useState(initialUsuarios)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [query, setQuery]                   = useState("")
  const [filtroRol, setFiltroRol]           = useState("todos")
  const [filtroEstado, setFiltroEstado]     = useState("todos")
  const [sortBy, setSortBy]                 = useState("fecha")
  const [sortDir, setSortDir]               = useState("desc")
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [pagina, setPagina]                 = useState(1)

  const toggleEstado   = useCallback((id) => {
    setUsuarios(us => us.map(u =>
      u._id === id ? { ...u, estado: u.estado === "activo" ? "suspendido" : "activo" } : u
    ))
  }, [])
  const guardarUsuario = useCallback((actualizado) => {
    setUsuarios(us => us.map(u => u._id === actualizado._id ? actualizado : u))
  }, [])
  const cerrarModal    = useCallback(() => setUsuarioEditando(null), [])

  // Stats derivadas del estado real
  const stats = useMemo(() => [
    { label: "Total",           valor: usuarios.length,                                        color: "text-slate-700"  },
    { label: "Superadmins",     valor: usuarios.filter(u => u.rol === "superadmin").length,    color: "text-purple-600" },
    { label: "Admins",          valor: usuarios.filter(u => u.rol === "admin").length,          color: "text-[#1c16cd]"  },
    { label: "Usuarios",        valor: usuarios.filter(u => u.rol === "usuario").length,        color: "text-slate-500"  },
    { label: "Activos",         valor: usuarios.filter(u => u.estado === "activo").length,      color: "text-[#0a8a1a]"  },
    { label: "Inactivos",       valor: usuarios.filter(u => u.estado !== "activo").length,      color: "text-[#d32f2f]"  },
  ], [usuarios])

  // Filtrado + ordenamiento
  const usuariosFiltrados = useMemo(() => {
    const q = query.toLowerCase()
    let resultado = usuarios.filter(u => {
      const matchQ = u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchR = filtroRol    === "todos" || u.rol    === filtroRol
      const matchE = filtroEstado === "todos" || u.estado === filtroEstado
      return matchQ && matchR && matchE
    })

    resultado.sort((a, b) => {
      let cmp = 0
      if (sortBy === "nombre") cmp = a.nombre.localeCompare(b.nombre, "es")
      if (sortBy === "fecha")  cmp = new Date(a.fechaRegistro) - new Date(b.fechaRegistro)
      return sortDir === "asc" ? cmp : -cmp
    })

    return resultado
  }, [usuarios, query, filtroRol, filtroEstado, sortBy, sortDir])

  // Paginación
  const totalPaginas  = Math.max(1, Math.ceil(usuariosFiltrados.length / PER_PAGE))
  const paginaActual  = Math.min(pagina, totalPaginas)
  const paginados     = usuariosFiltrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE)
  const desde         = usuariosFiltrados.length === 0 ? 0 : (paginaActual - 1) * PER_PAGE + 1
  const hasta         = Math.min(paginaActual * PER_PAGE, usuariosFiltrados.length)

  const irPagina = (n) => setPagina(Math.max(1, Math.min(n, totalPaginas)))

  // Generar números de página visibles
  const pageNums = useMemo(() => {
    const nums = []
    for (let i = 1; i <= totalPaginas; i++) nums.push(i)
    if (totalPaginas <= 7) return nums
    if (paginaActual <= 4) return [...nums.slice(0, 5), "…", totalPaginas]
    if (paginaActual >= totalPaginas - 3) return [1, "…", ...nums.slice(totalPaginas - 5)]
    return [1, "…", paginaActual - 1, paginaActual, paginaActual + 1, "…", totalPaginas]
  }, [totalPaginas, paginaActual])

  const hayFiltrosActivos = filtroRol !== "todos" || filtroEstado !== "todos"

  return (
    <div>
      {/* ── Encabezado ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-extrabold text-2xl text-[#171717] mb-0.5">Gestión de Usuarios</h2>
          <p className="text-slate-400 text-sm">Administra usuarios, roles y permisos de la plataforma</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1c16cd] hover:bg-[#1510a0] active:scale-[0.98] text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-all shadow-sm shadow-[#1c16cd]/30">
          <Icon name="person_add" size={17} />
          Agregar Admin
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {stats.map(({ label, valor, color }) => (
          <div key={label} className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-4">
            <p className={`font-extrabold text-2xl leading-none ${color}`}>{valor}</p>
            <p className="text-slate-400 text-xs mt-1.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de búsqueda y controles ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Search */}
        <div className="flex-1 flex items-center bg-white border-2 border-slate-200 rounded-2xl px-4 gap-3 focus-within:border-[#1c16cd]/80 transition-colors">
          <span className="material-symbols-rounded text-slate-300" style={{ fontSize: "20px" }}>search</span>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPagina(1) }}
            placeholder="Buscar por nombre o correo..."
            className="flex-1 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => { setQuery(""); setPagina(1) }} className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
            </button>
          )}
        </div>

        {/* Filtros toggle */}
        <button
          onClick={() => setFiltrosAbiertos(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all
            ${filtrosAbiertos || hayFiltrosActivos
              ? "bg-[#1c16cd] text-white border-[#1c16cd]"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
        >
          <Icon name="filter_list" size={17} />
          Filtros
          {hayFiltrosActivos && (
            <span className="w-4 h-4 bg-white/30 rounded-full text-[10px] font-bold flex items-center justify-center">
              {(filtroRol !== "todos" ? 1 : 0) + (filtroEstado !== "todos" ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Ordenar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPagina(1) }}
              className="appearance-none bg-white border-2 border-slate-200 rounded-2xl pl-4 pr-9 py-3 text-sm text-slate-600 outline-none focus:border-[#1c16cd]/80 transition-colors cursor-pointer font-medium"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>Ordenar: {o.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-rounded" style={{ fontSize: "18px" }}>
              expand_more
            </span>
          </div>
          <button
            onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
            title={sortDir === "asc" ? "Ascendente" : "Descendente"}
            className="flex items-center gap-1.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors whitespace-nowrap"
          >
            <Icon name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"} size={15} />
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {/* ── Panel de filtros expandible ── */}
      {filtrosAbiertos && (
        <div className="bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 mb-4 flex flex-col sm:flex-row gap-5">
          {/* Filtro por Rol */}
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Rol</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFiltroRol(value); setPagina(1) }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${filtroRol === value
                      ? "bg-[#1c16cd] text-white border-[#1c16cd]"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                >
                  {value !== "todos" && (
                    <span className="material-symbols-rounded" style={{ fontSize: "13px" }}>
                      {value === "superadmin" ? "admin_panel_settings" : value === "admin" ? "manage_accounts" : "person"}
                    </span>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px bg-slate-100" />

          {/* Filtro por Estado */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Estado</p>
            <div className="flex gap-2">
              {ESTADOS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFiltroEstado(value); setPagina(1) }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${filtroEstado === value
                      ? value === "activo"     ? "bg-[#13da28]/90 text-white border-[#13da28]/90"
                      : value === "suspendido" ? "bg-[#d32f2f] text-white border-[#d32f2f]"
                      :                          "bg-[#1c16cd] text-white border-[#1c16cd]"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                >
                  {value === "activo"     && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {value === "suspendido" && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Limpiar */}
          {hayFiltrosActivos && (
            <button
              onClick={() => { setFiltroRol("todos"); setFiltroEstado("todos"); setPagina(1) }}
              className="self-end text-xs text-slate-400 hover:text-[#d32f2f] font-medium transition-colors flex items-center gap-1"
            >
              <Icon name="close" size={13} /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Tabla ── */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[40%]">Usuario</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registro</th>
                <th className="text-right px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <span className="material-symbols-rounded block mx-auto mb-3 text-slate-200" style={{ fontSize: "44px" }}>
                      person_search
                    </span>
                    <p className="text-slate-400 text-sm font-medium">No se encontraron usuarios</p>
                    <p className="text-slate-300 text-xs mt-1">Prueba ajustando los filtros o la búsqueda</p>
                  </td>
                </tr>
              ) : (
                paginados.map(usuario => {
                  const esSuperadmin = usuario.rol === "superadmin"
                  const esAdmin      = usuario.rol === "admin" || esSuperadmin
                  const esActivo     = usuario.estado === "activo"
                  const badge        = rolBadge[usuario.rol] ?? rolBadge.usuario

                  return (
                    <tr
                      key={usuario._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Usuario */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${usuario.color}`}>
                            {usuario.iniciales}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm leading-tight truncate">{usuario.nombre}</p>
                            <p className="text-xs text-slate-400 truncate">{usuario.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                          <span className="material-symbols-rounded" style={{ fontSize: "12px" }}>{badge.icon}</span>
                          {badge.label}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full
                          ${esActivo ? "bg-[#13da28]/10 text-[#0a8a1a]" : "bg-[#d32f2f]/10 text-[#d32f2f]"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${esActivo ? "bg-[#13da28]" : "bg-[#d32f2f]"}`} />
                          {esActivo ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Registro */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-slate-500">{formatFecha(usuario.fechaRegistro)}</p>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setUsuarioEditando(usuario)}
                            title="Editar usuario"
                            className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1c16cd] hover:text-[#1c16cd] transition-colors"
                          >
                            <Icon name="edit" size={15} />
                          </button>

                          {!esSuperadmin ? (
                            <button
                              onClick={() => toggleEstado(usuario._id)}
                              title={esActivo ? "Suspender usuario" : "Activar usuario"}
                              className={`w-8 h-8 flex items-center justify-center rounded-xl border-2 transition-all
                                ${esActivo
                                  ? "border-[#d32f2f]/30 text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f]"
                                  : "border-[#13da28]/30 text-[#0a8a1a] hover:bg-[#13da28] hover:text-white hover:border-[#13da28]"}`}
                            >
                              <Icon name={esActivo ? "block" : "check_circle"} size={15} />
                            </button>
                          ) : (
                            <div
                              className="w-8 h-8 flex items-center justify-center text-purple-300"
                              title="Cuenta protegida"
                            >
                              <Icon name="shield" size={15} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Paginación ── */}
        {usuariosFiltrados.length > 0 && (
          <div className="px-6 py-3.5 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400 order-2 sm:order-1">
              Mostrando <span className="font-semibold text-slate-600">{desde}–{hasta}</span> de{" "}
              <span className="font-semibold text-slate-600">{usuariosFiltrados.length}</span> usuarios
            </p>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  onClick={() => irPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="chevron_left" size={16} />
                </button>

                {pageNums.map((n, i) =>
                  n === "…" ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => irPagina(n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold border-2 transition-all
                        ${n === paginaActual
                          ? "bg-[#1c16cd] text-white border-[#1c16cd]"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  onClick={() => irPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="chevron_right" size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal de edición ── */}
      {usuarioEditando && (
        <UsuarioModal
          usuario={usuarioEditando}
          onClose={cerrarModal}
          onGuardar={guardarUsuario}
        />
      )}
    </div>
  )
}

export default Usuarios
