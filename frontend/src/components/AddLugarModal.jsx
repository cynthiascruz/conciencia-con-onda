import { useState, useEffect } from "react"

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
const TAGS = [
  "Rampa de acceso", "Elevador", "Baño accesible", "Silla de ruedas",
  "Estacionamiento accesible", "Personal capacitado", "Entrada accesible",
  "Menú braille", "Personal LSM", "Senderos accesibles", "Audiolibros",
  "Señalización braille", "Juegos inclusivos", "Habitaciones adaptadas",
  "Transporte accesible", "Espacio amplio",
]

const inputCls = "w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#1c16cd] transition-colors"

const AddLugarModal = ({ onClose }) => {
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({
    nombre:          "",
    categoria:       "Museo",
    direccion:       "",
    descripcion:     "",
    imagen:          "",
    horarioResumido: "",
    sitioWeb:        "",
    accesibilidad:   [],
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
      : [...f.accesibilidad, tag],
  }))

  const puedeEnviar = form.nombre.trim() && form.direccion.trim() && form.descripcion.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-[slideUp_0.25s_ease]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>close</span>
        </button>

        {enviado ? (
          /* Estado de éxito */
          <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
            <div className="w-20 h-20 bg-[#13da28]/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-rounded text-[#13da28]" style={{ fontSize: "44px" }}>check_circle</span>
            </div>
            <h3 className="font-extrabold text-2xl text-[#171717]">¡Lugar enviado!</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Tu lugar fue enviado para revisión. Nuestro equipo lo revisará y lo publicará pronto.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-[#1c16cd]/90 text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1510a0] transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 pr-16">
              <h2 className="font-extrabold text-xl text-[#171717]">Agregar lugar</h2>
              <p className="text-slate-500 text-sm mt-0.5">Comparte un lugar accesible con la comunidad</p>
            </div>

            {/* Formulario */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex flex-col gap-5">

                {/* Nombre */}
                <div>
                  <label className="text-sm font-semibold text-[#171717] mb-1.5 block">
                    Nombre del lugar <span className="text-[#d32f2f]">*</span>
                  </label>
                  <input
                    value={form.nombre}
                    onChange={e => set("nombre", e.target.value)}
                    placeholder="Ej. Parque Fundidora"
                    className={inputCls}
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-sm font-semibold text-[#171717] mb-2 block">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map(cat => (
                      <button
                        key={cat}
                        onClick={() => set("categoria", cat)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                          form.categoria === cat
                            ? `${CATEGORIA_COLORS[cat]} text-white shadow-sm`
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dirección + Horario */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#171717] mb-1.5 block">
                      Dirección <span className="text-[#d32f2f]">*</span>
                    </label>
                    <input
                      value={form.direccion}
                      onChange={e => set("direccion", e.target.value)}
                      placeholder="Calle, colonia, ciudad"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#171717] mb-1.5 block">Horario</label>
                    <input
                      value={form.horarioResumido}
                      onChange={e => set("horarioResumido", e.target.value)}
                      placeholder="Lun-Dom 9:00 - 18:00"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-sm font-semibold text-[#171717] mb-1.5 block">
                    Descripción <span className="text-[#d32f2f]">*</span>
                  </label>
                  <textarea
                    value={form.descripcion}
                    onChange={e => set("descripcion", e.target.value)}
                    placeholder="Describe las características de accesibilidad del lugar..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Imagen + Sitio web */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#171717] mb-1.5 block">URL de imagen</label>
                    <input
                      value={form.imagen}
                      onChange={e => set("imagen", e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#171717] mb-1.5 block">Sitio web</label>
                    <input
                      value={form.sitioWeb}
                      onChange={e => set("sitioWeb", e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Accesibilidad */}
                <div>
                  <label className="text-sm font-semibold text-[#171717] mb-2 block">
                    Características de accesibilidad
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => {
                      const activo = form.accesibilidad.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all ${
                            activo
                              ? "bg-[#13da28]/10 text-[#0a8a1a] border-[#13da28]"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {activo && (
                            <span className="material-symbols-rounded" style={{ fontSize: "13px" }}>check_circle</span>
                          )}
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setEnviado(true)}
                disabled={!puedeEnviar}
                className="flex-1 py-3 rounded-xl bg-[#1c16cd]/90 text-white font-bold text-sm hover:bg-[#1510a0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>send</span>
                Enviar para revisión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AddLugarModal
