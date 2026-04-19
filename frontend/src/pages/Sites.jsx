import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { lugares, reseñas as reseñasIniciales } from "../data/lugares"
import PlaceCard from "../components/Placecard"
import Sidebar from "../components/Sidebar"
import PlaceModal from "../components/Placemodal"
import AddLugarModal from "../components/AddLugarModal"
import { useAuth } from "../context/AuthContext"

const Lugares = () => {
  const { usuario } = useAuth()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")

  // Sync con param ?q= si cambia por navegación
  useEffect(() => {
    const q = searchParams.get("q") ?? ""
    setQuery(q)
  }, [searchParams])

  const [lugarSeleccionado, setLugarSeleccionado] = useState(null)
  const [mostrarAddModal, setMostrarAddModal] = useState(false)
  const [reseñas, setReseñas] = useState(reseñasIniciales)
  const [filtros, setFiltros] = useState({
    categoria:       null,
    accesibilidad:   [],
    soloVerificados: false,
  })

  const sesionActiva = !!usuario

  // Lógica de filtrado
  const lugaresFiltrados = lugares.filter(lugar => {

    if (query && !lugar.nombre.toLowerCase().includes(query.toLowerCase()))
      return false

    if (filtros.categoria && lugar.categoria !== filtros.categoria)
      return false

    if (filtros.accesibilidad.length > 0) {
      const tieneTodasLasCaracteristicas = filtros.accesibilidad.every(f =>
        lugar.accesibilidad.includes(f)
      )
      if (!tieneTodasLasCaracteristicas) return false
    }

    if (filtros.soloVerificados && !lugar.verificado)
      return false

    return true
  })

  // Handlers
  const handleCategoria     = (cat) => setFiltros(f => ({ ...f, categoria: cat }))
  const handleVerificado    = (val) => setFiltros(f => ({ ...f, soloVerificados: val }))
  const handleAccesibilidad = (opcion) => {
    setFiltros(f => ({
      ...f,
      accesibilidad: f.accesibilidad.includes(opcion)
        ? f.accesibilidad.filter(a => a !== opcion)
        : [...f.accesibilidad, opcion]
    }))
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* Header */}
      <div className="bg-[#1c16cd]/90 px-6 py-12 text-center">
        <h1 className="font-extrabold text-4xl md:text-5xl text-white mb-3">
          Explora lugares <span className="text-[#faea1f]">accesibles</span>
        </h1>
        <p className="text-white/80 text-lg mb-10">
          Encuentra espacios verificados y adaptados para todos en Nuevo León
        </p>
        <div className="max-w-2xl mx-auto flex items-center bg-white/90 rounded-2xl overflow-hidden shadow-2xl border-[2px] border-white/90 focus-within:border-[#faea1f] transition-all duration-300">
          <div className="flex items-center flex-1 px-5 gap-4">
            <span className="material-icons-round text-[#1c16cd]">search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busca lugares, direcciones o características..."
              className="w-full py-2.5 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none font-medium"
            />
          </div>
          <div className="w-px h-8 bg-[#1c16cd]/80" />
          <div className="flex items-center gap-2 px-5 text-[#1c16cd]/90">
            <span className="material-icons-outlined">place</span>
            <span className="text-sm font-medium">Nuevo León</span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 items-start">

        <Sidebar
          filtros={filtros}
          onCategoriaChange={handleCategoria}
          onAccesibilidadChange={handleAccesibilidad}
          onVerificadoChange={handleVerificado}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-md font-bold text-slate-500">
              <span className="text-[#1c16cd]/90">{lugaresFiltrados.length}</span> lugares encontrados
            </p>
            {sesionActiva && (
              <button
                onClick={() => setMostrarAddModal(true)}
                className="flex items-center gap-2 bg-[#1c16cd]/90 hover:bg-[#1510a0] text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add_location_alt</span>
                Agregar lugar
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {lugaresFiltrados.length > 0 ? (
              lugaresFiltrados.map(lugar => (
                <PlaceCard
                  key={lugar._id}
                  lugar={lugar}
                  onClick={() => setLugarSeleccionado(lugar)}
                />
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-rounded text-slate-200 mb-4" style={{ fontSize: "56px" }}>location_off</span>
                <p className="font-black text-slate-700 text-lg mb-2">
                  No encontramos lugares
                </p>
                <p className="text-slate-400 text-sm">
                  Intenta con otros filtros o una búsqueda diferente
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal detalle del lugar */}
      {lugarSeleccionado && (
        <PlaceModal
          lugar={lugarSeleccionado}
          onClose={() => setLugarSeleccionado(null)}
          reseñasData={reseñas}
          onNuevaReseña={(nueva) => setReseñas(r => [...r, nueva])}
        />
      )}

      {/* Modal agregar lugar */}
      {mostrarAddModal && (
        <AddLugarModal onClose={() => setMostrarAddModal(false)} />
      )}

    </div>
  )
}

export default Lugares
