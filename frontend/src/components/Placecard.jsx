const PlaceCard = ({ lugar, onClick }) => {
  const {
    nombre,
    categoria,
    categoriaColor,
    direccion,
    descripcion,
    imagen,
    rating,
    verificado,
    reseñasCount,
    accesibilidad,
  } = lugar

  const tagsVisibles = accesibilidad.slice(0, 2)
  const tagsExtra    = accesibilidad.length - 2

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-slate-100 hover:border-[#1c16cd]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`${categoriaColor} text-white text-[12px] font-semibold px-2 py-1 rounded-full`}>
            {categoria}
          </span>
          {verificado && (
            <span className="bg-[#13da28]/90 text-white text-[12px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>check_circle</span>
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">

        <h3 className="font-bold text-lg text-[#171717] mb-1">{nombre}</h3>
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <span className="material-symbols-rounded shrink-0" style={{ fontSize: "14px" }}>location_on</span>
          <span className="truncate">{direccion}</span>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {descripcion}
        </p>

        {/* Tags de accesibilidad */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tagsVisibles.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 text-slate-600 text-[12px] font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {tagsExtra > 0 && (
            <span className="bg-[#b71c1c]/10 text-[#b71c1c]/90 text-[10px] font-medium px-3 py-1 rounded-full">
              +{tagsExtra} más
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-rounded text-[#13da28]" style={{ fontSize: "18px" }}>sentiment_excited</span>
              {reseñasCount.positivas}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-rounded text-[#d32f2f]" style={{ fontSize: "18px" }}>sentiment_stressed</span>
              {reseñasCount.negativas}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[#1c16cd] font-bold text-xs bg-[#1c16cd]/10 group-hover:bg-[#1c16cd] group-hover:text-white px-3 py-1.5 rounded-full transition-all duration-200">
            Ver más
            <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>arrow_forward</span>
          </span>
        </div>

      </div>
    </div>
  )
}

export default PlaceCard