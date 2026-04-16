import { kpis, lugaresPendientes, usuarios } from "../../../data/admin"
import { Icon } from "../constants"

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })

const hoy = new Date().toLocaleDateString("es-MX", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
})
const hoyCapital = hoy.charAt(0).toUpperCase() + hoy.slice(1)

const rolBadge = {
  superadmin: { label: "Superadmin",   bg: "bg-purple-100",   text: "text-purple-700" },
  admin:      { label: "Admin",        bg: "bg-[#1c16cd]/10", text: "text-[#1c16cd]"  },
  usuario:    { label: "Usuario",      bg: "bg-slate-100",    text: "text-slate-500"  },
}

const KpiCard = ({ valor, label, icon, color, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-4 text-left transition-all
      ${onClick ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}
  >
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0`}>
      <Icon name={icon} size={22} />
    </div>
    <div>
      <p className="font-bold text-2xl text-[#171717]">{valor}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  </button>
)

const PendingItem = ({ lugar, onRevisar }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className={`w-2 h-2 rounded-full shrink-0 ${lugar.categoriaColor}`} />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-800 text-sm truncate">{lugar.nombre}</p>
      <p className="text-slate-400 text-xs mt-0.5">
        {lugar.solicitadoPor} · {formatFecha(lugar.fechaSolicitud)}
      </p>
    </div>
    <button
      onClick={onRevisar}
      className="text-[#1c16cd] hover:text-[#1510a0] text-xs font-bold shrink-0 flex items-center gap-0.5 transition-colors"
    >
      Revisar <Icon name="chevron_right" size={14} />
    </button>
  </div>
)

const UserItem = ({ usuario }) => {
  const badge = rolBadge[usuario.rol] ?? rolBadge.usuario
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
        {usuario.iniciales}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm leading-tight truncate">{usuario.nombre}</p>
        <p className="text-slate-400 text-[11px] truncate">{usuario.email}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ setSeccion, pendientesCount }) => {
  const recentUsers    = [...usuarios]
    .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    .slice(0, 5)

  const recentPending  = lugaresPendientes.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Bienvenida ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium mb-1">{hoyCapital}</p>
          <h2 className="font-extrabold text-2xl text-[#171717] leading-tight">
            Panel de administración
          </h2>
        </div>

        {pendientesCount > 0 && (
          <button
            onClick={() => setSeccion("pendientes")}
            className="flex items-center gap-2 bg-[#ff8c2a]/10 hover:bg-[#ff8c2a]/20 text-[#c2620a] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff8c2a] animate-pulse" />
            {pendientesCount} pendiente{pendientesCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard valor={pendientesCount}       label="Lugares pendientes"  icon="pending_actions" color="bg-[#ff8c2a]/90" onClick={() => setSeccion("pendientes")} />
        <KpiCard valor={kpis.lugaresAprobados} label="Lugares aprobados"   icon="verified"        color="bg-[#13da28]/90" onClick={() => setSeccion("lugares")}    />
        <KpiCard valor={kpis.usuariosTotal}    label="Usuarios registrados" icon="group"           color="bg-[#1c16cd]/90" onClick={() => setSeccion("usuarios")}   />
        <KpiCard valor={kpis.reseñasTotal}     label="Reseñas publicadas"  icon="rate_review"     color="bg-[#7b1fa2]/90" />
      </div>

      {/* ── Dos columnas ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Solicitudes recientes */}
        <div className="xl:col-span-3 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-[15px]">Solicitudes pendientes</h3>
              <p className="text-slate-400 text-xs mt-0.5">Lugares esperando aprobación</p>
            </div>
            <button
              onClick={() => setSeccion("pendientes")}
              className="text-[#1c16cd] hover:text-[#1510a0] text-xs font-bold flex items-center gap-0.5 transition-colors"
            >
              Ver todas <Icon name="arrow_forward" size={14} />
            </button>
          </div>

          <div className="px-5">
            {recentPending.length === 0 ? (
              <div className="py-10 text-center">
                <span className="material-symbols-rounded text-slate-200 block mb-2" style={{ fontSize: "36px" }}>check_circle</span>
                <p className="text-slate-400 text-sm font-medium">Sin solicitudes pendientes</p>
              </div>
            ) : (
              recentPending.map(lugar => (
                <PendingItem
                  key={lugar._id}
                  lugar={lugar}
                  onRevisar={() => setSeccion("pendientes")}
                />
              ))
            )}
          </div>
        </div>

        {/* Usuarios recientes */}
        <div className="xl:col-span-2 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-[15px]">Usuarios recientes</h3>
              <p className="text-slate-400 text-xs mt-0.5">Últimos en registrarse</p>
            </div>
            <button
              onClick={() => setSeccion("usuarios")}
              className="text-[#1c16cd] hover:text-[#1510a0] text-xs font-bold flex items-center gap-0.5 transition-colors"
            >
              Ver todos <Icon name="arrow_forward" size={14} />
            </button>
          </div>

          <div className="px-5">
            {recentUsers.map(u => (
              <UserItem key={u._id} usuario={u} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Acciones rápidas ── */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Acciones rápidas</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Revisar pendientes", icon: "pending_actions", seccion: "pendientes", accent: "bg-[#ff8c2a]/10 text-[#c2620a] hover:bg-[#ff8c2a]/20" },
            { label: "Gestionar lugares",  icon: "location_on",     seccion: "lugares",    accent: "bg-[#13da28]/10 text-[#0a8a1a] hover:bg-[#13da28]/20" },
            { label: "Ver usuarios",       icon: "group",           seccion: "usuarios",   accent: "bg-[#1c16cd]/10 text-[#1c16cd] hover:bg-[#1c16cd]/20" },
            { label: "Volver al inicio",   icon: "home",            seccion: null,         accent: "bg-slate-100 text-slate-600 hover:bg-slate-200", href: "/" },
          ].map(({ label, icon, seccion, accent, href }) => (
            <button
              key={label}
              onClick={() => seccion ? setSeccion(seccion) : window.location.assign(href)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-colors text-left ${accent}`}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
