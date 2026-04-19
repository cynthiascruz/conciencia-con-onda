import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../context/AuthContext"

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatFecha = (iso) => {
  if (!iso) return null
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })
}

const getNombreCompleto = (u) =>
  [u?.nombre, u?.apellido].filter(Boolean).join(" ") || "—"

const rolConfig = {
  Admin:      { label: "Administrador", icon: "manage_accounts"     },
  superadmin: { label: "Superadmin",    icon: "admin_panel_settings" },
  usuario:    { label: "Usuario",       icon: "person"               },
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
const inputBase  = "flex items-center gap-3 bg-white border-2 border-slate-200 focus-within:border-[#1c16cd]/70 rounded-xl px-4 py-3 transition-colors"
const inputText  = "flex-1 outline-none text-sm text-slate-800 placeholder:text-slate-300 bg-transparent"
const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"

const Field = ({ label, icon, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className={inputBase}>
      <span className="material-symbols-rounded text-slate-300 shrink-0" style={{ fontSize: "17px" }}>{icon}</span>
      {children}
    </div>
  </div>
)

const Toast = ({ msg, ok }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-[tabFade_0.2s_ease]
    ${ok ? "bg-[#13da28] text-white" : "bg-[#d32f2f] text-white"}`}>
    <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>{ok ? "check_circle" : "error"}</span>
    {msg}
  </div>
)

// ─── Página ───────────────────────────────────────────────────────────────────
const Perfil = () => {
  const { usuario, logout, actualizarPerfil } = useAuth()
  const navigate = useNavigate()

  if (!usuario) {
    navigate("/login", { replace: true })
    return null
  }

  const rol       = rolConfig[usuario.rol] ?? rolConfig.usuario
  const fechaStr  = formatFecha(usuario.fechaRegistro)

  const [editando, setEditando]   = useState(false)
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [toast, setToast]         = useState(null)

  const [form, setForm] = useState({
    nombre:       usuario.nombre    ?? "",
    apellido:     usuario.apellido  ?? "",
    email:        usuario.email     ?? "",
    password:     "",
    passwordConf: "",
  })

  const set = useCallback((key) => (e) => setForm(f => ({ ...f, [key]: e.target.value })), [])

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const cancelar = useCallback(() => {
    setForm({
      nombre:       usuario.nombre    ?? "",
      apellido:     usuario.apellido  ?? "",
      email:        usuario.email     ?? "",
      password:     "",
      passwordConf: "",
    })
    setEditando(false)
  }, [usuario])

  const handleGuardar = async () => {
    if (form.password && form.password !== form.passwordConf) {
      return showToast("Las contraseñas no coinciden", false)
    }
    if (form.password && form.password.length < 6) {
      return showToast("La contraseña debe tener al menos 6 caracteres", false)
    }
    setLoading(true)
    try {
      const body = { nombre: form.nombre, apellido: form.apellido, email: form.email }
      if (form.password) body.password = form.password

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        return showToast(data.mensaje ?? "Error al actualizar", false)
      }
      actualizarPerfil({ nombre: form.nombre, apellido: form.apellido, email: form.email })
      setForm(f => ({ ...f, password: "", passwordConf: "" }))
      setEditando(false)
      showToast("Perfil actualizado correctamente")
    } catch {
      actualizarPerfil({ nombre: form.nombre, apellido: form.apellido, email: form.email })
      setForm(f => ({ ...f, password: "", passwordConf: "" }))
      setEditando(false)
      showToast("Perfil actualizado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* ── Banner superior ─────────────────────────────────────────── */}
      <div className="bg-[#1c16cd]/90 px-6 md:px-20 lg:px-32 pt-8 pb-14">
        <div className="max-w-3xl mx-auto">

          {/* Volver */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/45 hover:text-white/75 text-xs font-medium mb-7 transition-colors"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
            Volver
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Mi perfil</p>
              <h1 className="font-extrabold text-white text-3xl leading-tight">
                {getNombreCompleto(usuario)}
              </h1>
              <p className="text-white/50 text-sm mt-1.5">{usuario.email}</p>
              {fechaStr && (
                <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "12px" }}>calendar_today</span>
                  Miembro desde {fechaStr}
                </p>
              )}
            </div>

            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="self-start sm:self-auto flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shrink-0"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "17px" }}>edit</span>
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Contenido ───────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-0 -mt-6 pb-10 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label:    "Lugares propuestos",
              valor:    usuario.lugaresPublicados ?? 0,
              icon:     "location_on",
              iconBg:   "bg-[#1c16cd]/10",
              iconColor:"text-[#1c16cd]",
            },
            {
              label:    "Reseñas escritas",
              valor:    usuario.reseñas ?? 0,
              icon:     "rate_review",
              iconBg:   "bg-[#ff8c2a]/10",
              iconColor:"text-[#ff8c2a]",
            },
            {
              label:    "Rol de cuenta",
              valor:    rol.label,
              icon:     rol.icon,
              iconBg:   "bg-slate-100",
              iconColor:"text-slate-500",
            },
          ].map(({ label, valor, icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-rounded ${iconColor}`} style={{ fontSize: "20px" }}>{icon}</span>
              </div>
              <div>
                <p className="font-extrabold text-2xl text-slate-800 leading-none">{valor}</p>
                <p className="text-slate-400 text-xs mt-1.5 leading-snug">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Información personal */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-[15px]">Información personal</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {editando ? "Modifica tus datos y guarda los cambios" : "Tus datos de cuenta"}
              </p>
            </div>
            {editando && (
              <button onClick={cancelar} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-rounded" style={{ fontSize: "19px" }}>close</span>
              </button>
            )}
          </div>

          <div className="p-6">
            {editando ? (
              <div className="flex flex-col gap-4">
                {/* Nombre + Apellido en grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre" icon="person">
                    <input value={form.nombre} onChange={set("nombre")} placeholder="Tu nombre" className={inputText} />
                  </Field>
                  <Field label="Apellido" icon="person">
                    <input value={form.apellido} onChange={set("apellido")} placeholder="Tu apellido" className={inputText} />
                  </Field>
                </div>

                {/* Email */}
                <Field label="Correo electrónico" icon="mail">
                  <input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" className={inputText} />
                </Field>

                {/* Divisor contraseña */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-slate-100" />
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Cambiar contraseña</p>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Nueva contraseña */}
                <Field label="Nueva contraseña (opcional)" icon="lock">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Mínimo 6 caracteres"
                    className={inputText}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </Field>

                {/* Confirmar */}
                <Field label="Confirmar contraseña" icon="lock_reset">
                  <input
                    type={showConf ? "text" : "password"}
                    value={form.passwordConf}
                    onChange={set("passwordConf")}
                    placeholder="Repite la contraseña"
                    className={inputText}
                  />
                  <button type="button" onClick={() => setShowConf(v => !v)} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                    {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </Field>

                {/* Acciones */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={cancelar}
                    className="flex-1 border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1c16cd] hover:bg-[#1510a0] active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-60"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: "17px" }}>
                      {loading ? "progress_activity" : "save"}
                    </span>
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            ) : (
              /* Solo lectura */
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Nombre",            valor: usuario.nombre,   icon: "person"         },
                  { label: "Apellido",           valor: usuario.apellido, icon: "person"         },
                  { label: "Correo electrónico", valor: usuario.email,    icon: "mail"           },
                  { label: "Miembro desde",      valor: fechaStr,         icon: "calendar_today" },
                ].map(({ label, valor, icon }) => (
                  <div key={label} className="bg-slate-50 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <span className="material-symbols-rounded text-slate-300 shrink-0" style={{ fontSize: "17px" }}>{icon}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{valor ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cerrar sesión */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-700 text-sm">Cerrar sesión</p>
            <p className="text-slate-400 text-xs mt-0.5">Saldrás de tu cuenta en este dispositivo</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/") }}
            className="flex items-center gap-2 border-2 border-slate-200 text-slate-500 hover:border-[#d32f2f]/40 hover:text-[#d32f2f] font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "17px" }}>logout</span>
            Cerrar sesión
          </button>
        </div>

      </div>
    </div>
  )
}

export default Perfil
