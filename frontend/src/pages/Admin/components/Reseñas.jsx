import { useState, useMemo, useCallback, memo } from "react"
import { reseñas as reseñasIniciales } from "../../../data/lugares"
import { Icon } from "../constants"

const PER_PAGE = 10

const ESTADOS_FILTRO = [
  { value: "Todas",     label: "Todas"     },
  { value: "Publicada", label: "Publicada" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Eliminada", label: "Eliminada" },
]

const TIPOS_FILTRO = [
  { value: "todos",     label: "Todos"     },
  { value: "positiva",  label: "Positiva"  },
  { value: "negativa",  label: "Negativa"  },
]

const estadoCfg = {
  Publicada: { bg: "bg-[#13da28]/10", text: "text-[#0a8a1a]", dot: "bg-[#13da28]"  },
  Pendiente: { bg: "bg-[#ff8c2a]/10", text: "text-[#c2620a]", dot: "bg-[#ff8c2a]"  },
  Eliminada: { bg: "bg-[#d32f2f]/10", text: "text-[#d32f2f]", dot: "bg-[#d32f2f]"  },
}

// ─── Fila memoizada ───────────────────────────────────────────────────────────
const ReseñaRow = memo(({ r, onCambiar }) => {
  const cfg = estadoCfg[r.estado] ?? estadoCfg.Publicada
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">

      {/* Usuario */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {r.usuarioIniciales}
          </div>
          <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">{r.usuarioNombre}</span>
        </div>
      </td>

      {/* Reseña */}
      <td className="px-4 py-3.5 max-w-[260px]">
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{r.texto}</p>
      </td>

      {/* Lugar */}
      <td className="px-4 py-3.5">
        <span className="text-slate-600 text-sm font-medium whitespace-nowrap">{r.lugarNombre ?? "—"}</span>
      </td>

      {/* Tipo */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full
          ${r.tipo === "positiva" ? "bg-[#13da28]/10 text-[#0a8a1a]" : "bg-[#d32f2f]/10 text-[#d32f2f]"}`}>
          <span className="material-symbols-rounded" style={{ fontSize: "12px" }}>
            {r.tipo === "positiva" ? "sentiment_excited" : "sentiment_stressed"}
          </span>
          {r.tipo === "positiva" ? "Positiva" : "Negativa"}
        </span>
      </td>

      {/* Estado */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          {r.estado}
        </span>
      </td>

      {/* Fecha */}
      <td className="px-4 py-3.5">
        <p className="text-sm text-slate-500 whitespace-nowrap">{r.fecha}</p>
      </td>

      {/* Acciones */}
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-2">
          {r.estado === "Pendiente" && (
            <>
              <button
                onClick={() => onCambiar(r._id, "Publicada")}
                title="Aprobar"
                className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-[#13da28]/30 text-[#0a8a1a] hover:bg-[#13da28] hover:text-white hover:border-[#13da28] transition-all"
              >
                <Icon name="check" size={15} />
              </button>
              <button
                onClick={() => onCambiar(r._id, "Eliminada")}
                title="Rechazar"
                className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-[#d32f2f]/30 text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f] transition-all"
              >
                <Icon name="close" size={15} />
              </button>
            </>
          )}
          {r.estado === "Publicada" && (
            <button
              onClick={() => onCambiar(r._id, "Eliminada")}
              title="Eliminar"
              className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-[#d32f2f]/30 text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f] transition-all"
            >
              <Icon name="delete" size={15} />
            </button>
          )}
          {r.estado === "Eliminada" && (
            <button
              onClick={() => onCambiar(r._id, "Publicada")}
              title="Restaurar"
              className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-[#1c16cd]/30 text-[#1c16cd] hover:bg-[#1c16cd] hover:text-white hover:border-[#1c16cd] transition-all"
            >
              <Icon name="restore" size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
})
ReseñaRow.displayName = "ReseñaRow"

// ─── Componente principal ─────────────────────────────────────────────────────
const Reseñas = ({ onPendingCountChange }) => {
  const [reseñas, setReseñas]               = useState(reseñasIniciales)
  const [search, setSearch]                 = useState("")
  const [filtroEstado, setFiltroEstado]     = useState("Todas")
  const [filtroTipo, setFiltroTipo]         = useState("todos")
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [pagina, setPagina]                 = useState(1)

  // Stats
  const stats = useMemo(() => [
    { label: "Total",         valor: reseñas.length,                                          color: "text-slate-700"  },
    { label: "Publicadas",    valor: reseñas.filter(r => r.estado === "Publicada").length,    color: "text-[#0a8a1a]"  },
    { label: "Pendientes IA", valor: reseñas.filter(r => r.estado === "Pendiente").length,    color: "text-[#ff8c2a]"  },
    { label: "Eliminadas",    valor: reseñas.filter(r => r.estado === "Eliminada").length,    color: "text-[#d32f2f]"  },
  ], [reseñas])

  // Filtrado
  const filtradas = useMemo(() => reseñas.filter(r => {
    if (filtroEstado !== "Todas" && r.estado !== filtroEstado) return false
    if (filtroTipo   !== "todos" && r.tipo   !== filtroTipo)   return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.texto.toLowerCase().includes(q) ||
        r.usuarioNombre.toLowerCase().includes(q) ||
        (r.lugarNombre?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  }), [reseñas, filtroEstado, filtroTipo, search])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PER_PAGE))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginados    = filtradas.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE)
  const desde        = filtradas.length === 0 ? 0 : (paginaActual - 1) * PER_PAGE + 1
  const hasta        = Math.min(paginaActual * PER_PAGE, filtradas.length)

  const cambiarEstado = useCallback((id, nuevoEstado) => {
    setReseñas(prev => {
      const updated = prev.map(r => r._id === id ? { ...r, estado: nuevoEstado } : r)
      onPendingCountChange?.(updated.filter(r => r.estado === "Pendiente").length)
      return updated
    })
  }, [onPendingCountChange])

  const limpiarFiltros      = useCallback(() => { setFiltroEstado("Todas"); setFiltroTipo("todos"); setPagina(1) }, [])
  const hayFiltrosActivos   = filtroEstado !== "Todas" || filtroTipo !== "todos"

  return (
    <div className="w-full">
      {/* ── Encabezado ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-extrabold text-2xl text-[#171717] mb-0.5">Moderación de Reseñas</h2>
          <p className="text-slate-400 text-sm">
            La IA analiza el contenido automáticamente; revisa las marcadas como{" "}
            <span className="text-[#ff8c2a] font-semibold">Pendiente</span>
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, valor, color }) => (
          <div key={label} className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-4">
            <p className={`font-extrabold text-2xl leading-none ${color}`}>{valor}</p>
            <p className="text-slate-400 text-xs mt-1.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de búsqueda y controles ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Búsqueda */}
        <div className="flex-1 flex items-center bg-white border-2 border-slate-200 rounded-2xl px-4 gap-3 focus-within:border-[#1c16cd]/80 transition-colors">
          <span className="material-symbols-rounded text-slate-300" style={{ fontSize: "20px" }}>search</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPagina(1) }}
            placeholder="Buscar por reseña, usuario o lugar..."
            className="flex-1 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPagina(1) }} className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
            </button>
          )}
        </div>

        {/* Toggle filtros */}
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
              {(filtroEstado !== "Todas" ? 1 : 0) + (filtroTipo !== "todos" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Panel de filtros expandible ── */}
      {filtrosAbiertos && (
        <div className="bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 mb-4 flex flex-col sm:flex-row gap-5">

          {/* Estado */}
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Estado</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS_FILTRO.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFiltroEstado(value); setPagina(1) }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${filtroEstado === value
                      ? value === "Publicada" ? "bg-[#13da28]/90 text-white border-[#13da28]/90"
                      : value === "Pendiente" ? "bg-[#ff8c2a]   text-white border-[#ff8c2a]"
                      : value === "Eliminada" ? "bg-[#d32f2f]   text-white border-[#d32f2f]"
                      :                         "bg-[#1c16cd]   text-white border-[#1c16cd]"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                >
                  {value !== "Todas" && (
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      filtroEstado === value ? "bg-white" :
                      value === "Publicada" ? "bg-[#13da28]" :
                      value === "Pendiente" ? "bg-[#ff8c2a]" : "bg-[#d32f2f]"
                    }`} />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px bg-slate-100" />

          {/* Tipo */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Tipo</p>
            <div className="flex gap-2">
              {TIPOS_FILTRO.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFiltroTipo(value); setPagina(1) }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${filtroTipo === value
                      ? value === "positiva" ? "bg-[#13da28]/90 text-white border-[#13da28]/90"
                      : value === "negativa" ? "bg-[#d32f2f]   text-white border-[#d32f2f]"
                      :                        "bg-[#1c16cd]   text-white border-[#1c16cd]"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                >
                  {value === "positiva" && (
                    <span className="material-symbols-rounded" style={{ fontSize: "13px" }}>sentiment_excited</span>
                  )}
                  {value === "negativa" && (
                    <span className="material-symbols-rounded" style={{ fontSize: "13px" }}>sentiment_stressed</span>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Limpiar */}
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
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
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reseña</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lugar</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                <th className="text-right px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <span className="material-symbols-rounded block mx-auto mb-3 text-slate-200" style={{ fontSize: "44px" }}>
                      rate_review
                    </span>
                    <p className="text-slate-400 text-sm font-medium">No se encontraron reseñas</p>
                    <p className="text-slate-300 text-xs mt-1">Prueba ajustando los filtros o la búsqueda</p>
                  </td>
                </tr>
              ) : (
                paginados.map(r => (
                  <ReseñaRow key={r._id} r={r} onCambiar={cambiarEstado} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Paginación ── */}
        {filtradas.length > 0 && (
          <div className="px-6 py-3.5 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400 order-2 sm:order-1">
              Mostrando <span className="font-semibold text-slate-600">{desde}–{hasta}</span> de{" "}
              <span className="font-semibold text-slate-600">{filtradas.length}</span> reseñas
            </p>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="chevron_left" size={16} />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPagina(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold border-2 transition-all
                      ${p === paginaActual
                        ? "bg-[#1c16cd] text-white border-[#1c16cd]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
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
    </div>
  )
}

export default Reseñas
