import { useState, useEffect } from "react"

const PlaceModal = ({ lugar, onClose, reseñasData = [], onNuevaReseña }) => {
  const [reseñas, setReseñas] = useState(() =>
    reseñasData.filter(r => r.lugarId === lugar._id)
  )
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipoReseña, setTipoReseña]   = useState("positiva")
  const [textoReseña, setTextoReseña] = useState("")

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  if (!lugar) return null

  const {
    nombre,
    categoria,
    categoriaColor,
    descripcion,
    direccion,
    imagen,
    verificado,
    reseñasCount,
    accesibilidad,
    horarioResumido,
    sitioWeb,
  } = lugar

  const handlePublicar = () => {
    if (!textoReseña.trim()) return
    const nueva = {
      _id:              `res_${Date.now()}`,
      lugarId:          lugar._id,
      usuarioNombre:    "Tú",
      usuarioIniciales: "TU",
      tipo:             tipoReseña,
      texto:            textoReseña.trim(),
      fecha:            new Date().toISOString().split("T")[0],
    }
    setReseñas(r => [...r, nueva])
    if (onNuevaReseña) onNuevaReseña(nueva)
    setTextoReseña("")
    setMostrarForm(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-[slideUp_0.25s_ease]">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Cerrar"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>close</span>
        </button>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[90vh]">

          {/* Imagen hero */}
          <div className="relative h-60 md:h-72 overflow-hidden">
            <img
              src={imagen}
              alt={nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Badges + nombre sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`${categoriaColor} text-white text-[12px] font-semibold px-2 py-1 rounded-full`}>
                  {categoria}
                </span>
                {verificado && (
                  <span className="bg-[#13da28] text-white text-[12px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>check_circle</span>
                    Verificado
                  </span>
                )}
              </div>
              <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-white">
                {nombre}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">

            {/* Contador de reseñas */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-[#13da28]/10 px-3 py-2 rounded-full">
                <span className="material-symbols-rounded text-[#13da28]" style={{ fontSize: "20px" }}>sentiment_excited</span>
                <span className="font-bold text-[#13da28] text-sm">{reseñasCount.positivas}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#d32f2f]/10 px-3 py-2 rounded-full">
                <span className="material-symbols-rounded text-[#d32f2f]" style={{ fontSize: "20px" }}>sentiment_stressed</span>
                <span className="font-bold text-[#d32f2f] text-sm">{reseñasCount.negativas}</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="font-bold text-base text-[#171717] mb-2">Sobre este lugar</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{descripcion}</p>
            </div>

            {/* Accesibilidad */}
            <div className="mb-6">
              <h3 className="font-bold text-base text-[#171717] mb-3">
                Características de Accesibilidad
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {accesibilidad.map(feature => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 bg-[#13da28]/10 text-[#0a8a1a] px-3 py-2 rounded-xl"
                  >
                    <span className="material-symbols-rounded shrink-0" style={{ fontSize: "16px" }}>check_circle</span>
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
                    <p className="text-sm font-semibold text-slate-700">{direccion}</p>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ff8c2a]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[#ff8c2a]" style={{ fontSize: "18px" }}>schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Horario</p>
                    <p className="text-sm font-semibold text-slate-700">{horarioResumido}</p>
                  </div>
                </div>

                {/* Sitio web */}
                {sitioWeb && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#7b1fa2]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-rounded text-[#7b1fa2]" style={{ fontSize: "18px" }}>language</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Sitio web</p>
                      <a
                        href={sitioWeb}
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

            {/* Reseñas de la comunidad */}
            <div className="mb-6">
              <h3 className="font-bold text-base text-[#171717] mb-3">
                Reseñas de la comunidad
                {reseñas.length > 0 && (
                  <span className="ml-2 text-xs font-semibold text-slate-400">({reseñas.length})</span>
                )}
              </h3>

              {reseñas.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl">
                  <span className="material-symbols-rounded text-slate-300 block mb-2" style={{ fontSize: "36px" }}>chat_bubble</span>
                  <p className="text-slate-400 text-sm font-medium">Aún no hay reseñas</p>
                  <p className="text-slate-300 text-xs mt-0.5">¡Sé el primero en compartir tu experiencia!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reseñas.map(r => (
                    <div key={r._id} className="bg-slate-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-rounded ${r.tipo === "positiva" ? "text-[#13da28]" : "text-[#d32f2f]"}`}
                            style={{ fontSize: "20px" }}
                          >
                            {r.tipo === "positiva" ? "sentiment_excited" : "sentiment_stressed"}
                          </span>
                          <span className="text-sm font-bold text-slate-700">{r.usuarioNombre}</span>
                        </div>
                        <span className="text-xs text-slate-400">{r.fecha}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{r.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acción / Formulario de reseña */}
            <div className="pt-4 border-t border-slate-100">
              {!mostrarForm ? (
                <button
                  onClick={() => setMostrarForm(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#ff8c2a] text-[#ff8c2a]/90 hover:bg-[#ff8c2a]/90 hover:text-white font-bold text-sm py-4 rounded-full transition-colors"
                >
                  <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>hotel_class</span>
                  Agregar reseña
                </button>
              ) : (
                <div className="flex flex-col gap-3">

                  {/* Tipo */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTipoReseña("positiva")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        tipoReseña === "positiva"
                          ? "bg-[#13da28]/10 border-[#13da28] text-[#0a8a1a]"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>sentiment_excited</span>
                      Positiva
                    </button>
                    <button
                      onClick={() => setTipoReseña("negativa")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        tipoReseña === "negativa"
                          ? "bg-[#d32f2f]/10 border-[#d32f2f] text-[#d32f2f]"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>sentiment_stressed</span>
                      Negativa
                    </button>
                  </div>

                  {/* Texto */}
                  <textarea
                    value={textoReseña}
                    onChange={e => setTextoReseña(e.target.value)}
                    placeholder="Comparte tu experiencia con este lugar..."
                    rows={3}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#1c16cd] transition-colors resize-none"
                  />

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setMostrarForm(false); setTextoReseña("") }}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handlePublicar}
                      disabled={!textoReseña.trim()}
                      className="flex-1 py-3 rounded-xl bg-[#ff8c2a] text-white font-bold text-sm hover:bg-[#e67a1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>send</span>
                      Publicar reseña
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceModal
