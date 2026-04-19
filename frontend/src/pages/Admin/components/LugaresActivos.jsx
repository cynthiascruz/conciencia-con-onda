import { useState, useEffect } from "react"
import { lugaresAprobados as initialAprobados } from "../../../data/admin"
import { reseñas as initialReseñas } from "../../../data/lugares"
import { Icon, CATEGORIAS, CATEGORIA_COLORS, TAGS_ACCESIBILIDAD } from "../constants"

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

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Icon name="close" size={20} />
        </button>

        {/* Hero */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={form.imagen}
            alt={form.nombre}
            className="w-full h-full object-cover"
            onError={e => e.target.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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

          {/* Tab Editar */}
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

          {/* Tab Reseñas */}
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
    <div className="w-full">
      <h2 className="font-extrabold text-2xl text-[#171717] mb-1">Lugares</h2>
      <p className="text-slate-400 text-sm mb-6">Gestiona todos los lugares aprobados en la plataforma</p>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

        <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl px-3 py-1.5">
          {[
            { key: "todos",     label: "Todos"     },
            { key: "activos",   label: "Activos"   },
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
              <div className="relative h-36 overflow-hidden">
                <img src={lugar.imagen} alt={lugar.nombre} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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

              <div className="p-4">
                <p className="font-bold text-[#171717] text-sm mb-1 truncate">{lugar.nombre}</p>
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

export default LugaresActivos
