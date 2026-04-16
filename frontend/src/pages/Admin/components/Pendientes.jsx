import { useState, useEffect } from "react"
import { lugaresPendientes as initialPendientes } from "../../../data/admin"
import { Icon, CATEGORIAS, CATEGORIA_COLORS, TAGS_ACCESIBILIDAD } from "../constants"

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

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Icon name="close" size={20} />
        </button>

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
                <div className="mb-6">
                  <h3 className="font-bold text-base text-[#171717] mb-2">Sobre este lugar</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{form.descripcion}</p>
                </div>

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

                <div className="mb-6">
                  <h3 className="font-bold text-base text-[#171717] mb-3">Información</h3>
                  <div className="space-y-3">

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1c16cd]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-rounded text-[#1c16cd]" style={{ fontSize: "18px" }}>location_on</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Dirección</p>
                        <p className="text-sm font-semibold text-slate-700">{form.direccion}</p>
                      </div>
                    </div>

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

export default Pendientes
