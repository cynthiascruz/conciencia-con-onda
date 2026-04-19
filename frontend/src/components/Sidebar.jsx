import { useState } from "react"
import { categorias } from "../data/lugares"

const accesibilidadOpciones = [
  "Rampa de acceso",
  "Elevador",
  "Baño accesible",
  "Silla de ruedas",
  "Estacionamiento accesible",
  "Personal capacitado",
  "Entrada accesible",
  "Menú braille",
  "Personal LSM",
  "Senderos accesibles",
  "Audiolibros",
  "Señalización braille",
  "Juegos inclusivos",
  "Habitaciones adaptadas",
  "Transporte accesible",
  "Espacio amplio",
]

const Sidebar = ({ filtros, onCategoriaChange, onAccesibilidadChange, onVerificadoChange }) => {
  const [queryAcc, setQueryAcc] = useState("")

  const hayFiltros = filtros.categoria !== null || filtros.accesibilidad.length > 0 || filtros.soloVerificados

  const limpiarTodo = () => {
    onCategoriaChange(null)
    filtros.accesibilidad.forEach(op => onAccesibilidadChange(op))
    onVerificadoChange(false)
    setQueryAcc("")
  }

  const opcionesFiltradas = accesibilidadOpciones.filter(op =>
    op.toLowerCase().includes(queryAcc.toLowerCase())
  )

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#1c16cd]/90 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="material-symbols-rounded">filter_alt</span>
            </div>
            <h2 className="font-bold text-[#171717]">Filtros</h2>
          </div>
          {hayFiltros && (
            <button
              onClick={limpiarTodo}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#d32f2f] font-medium transition-colors"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>close</span>
              Limpiar
            </button>
          )}
        </div>

        {/* Categoría */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm text-slate-700 mb-3">Categoría</h3>
          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => onCategoriaChange(null)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-colors
                ${filtros.categoria === null
                  ? "bg-[#1c16cd]/90 text-white border-[#1c16cd]/90"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#1c16cd]/90"
                }`}
            >
              Todos
            </button>

            {categorias.map(cat => (
              <button
                key={cat._id}
                onClick={() => onCategoriaChange(cat.nombre)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-colors
                  ${filtros.categoria === cat.nombre
                    ? "bg-[#1c16cd]/90 text-white border-[#1c16cd]/90"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#1c16cd]/90"
                  }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 mb-6" />

        {/* Accesibilidad */}
        <div className="mb-6">
          <h3 className="font-bold text-sm text-slate-700 mb-3">Accesibilidad</h3>

          {/* Buscador */}
          <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 mb-3 focus-within:border-[#1c16cd] transition-colors">
            <span className="material-symbols-rounded text-slate-400" style={{ fontSize: "16px" }}>search</span>
            <input
              type="text"
              value={queryAcc}
              onChange={e => setQueryAcc(e.target.value)}
              placeholder="Buscar característica..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-300 outline-none"
            />
            {queryAcc && (
              <button onClick={() => setQueryAcc("")} className="text-slate-300 hover:text-slate-500 transition-colors">
                <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>close</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
            {opcionesFiltradas.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">Sin resultados</p>
            ) : (
              opcionesFiltradas.map(opcion => {
                const checked = filtros.accesibilidad.includes(opcion)
                return (
                  <label key={opcion} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => onAccesibilidadChange(opcion)}
                      className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border-2 transition-colors
                        ${checked ? "bg-[#10c223] border-[#10c223]" : "bg-white border-slate-300 group-hover:border-[#10c223]"}`}
                    >
                      {checked && (
                        <span className="material-symbols-rounded text-white" style={{ fontSize: "12px", fontVariationSettings: "'wght' 700" }}>check</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-[#171717] transition-colors">
                      {opcion}
                    </span>
                  </label>
                )
              })
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 mb-6" />

        {/* Solo verificados */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-slate-700">Solo verificados</p>
            <p className="text-xs text-slate-400">Lugares verificados por el equipo</p>
          </div>
          <button
            onClick={() => onVerificadoChange(!filtros.soloVerificados)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200
              ${filtros.soloVerificados ? "bg-[#1c16cd]/90" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
              ${filtros.soloVerificados ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar
