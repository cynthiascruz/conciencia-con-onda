const features = [
  {
    icon: <span className="material-icons-round">accessible</span>,
    color: "bg-[#1c16cd]/90",
    title: "Accesibilidad Verificada",
    desc: "Cada lugar es evaluado con criterios estrictos — rampas, elevadores, baños adaptados y más.",
  },
  {
    icon: <span className="material-icons-round">place</span>,
    color: "bg-[#ff8c2a]",
    title: "Monterrey Interactivo",
    desc: "Encuentra lugares cercanos con filtros de accesibilidad.",
  },
  {
    icon: <span className="material-icons-round">star</span>,
    color: "bg-[#faea1f]/80",
    textDark: true,
    title: "Reseñas Reales",
    desc: "Opiniones de personas con o sin discapacidad sobre cada lugar. Sin filtros, sin adornos.",
  },
  {
    icon: <span className="material-icons-round">group</span>,
    color: "bg-[#13da28]",
    title: "Comunidad Activa",
    desc: "Únete a miles de personas que comparten experiencias y mejoran la ciudad juntos.",
  },
  {
    icon: <span className="material-icons-round">verified</span>,
    color: "bg-[#7b1fa2]",
    title: "Información Confiable",
    desc: "Datos actualizados y verificados por nuestro equipo y la comunidad.",
  },
  {
    icon: <span className="material-icons-round">favorite</span>,
    color: "bg-[#d32f2f]",
    title: "Impacto Social",
    desc: "Contribuye a una ciudad más inclusiva para todos.",
  },
]

const Features = () => {
  return (
    <section className="bg-[#f8f8f8] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-[#13da28] text-white text-[14px] font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            Características
          </span>
          <h2 className="font-extrabold text-[clamp(2rem,5vw,3.0rem)] leading-tight tracking-tight text-[#171717] mb-4">
            Todo lo que necesitas para{" "}
            <span className="text-[#1a18cd]/90">explorar con onda</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl">
            Herramientas diseñadas para hacer tu experiencia más fácil, segura y accesible.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, color, textDark, title, desc }) => (
            <div
              key={title}
              className="group bg-white border-2 border-transparent rounded-2xl p-6 hover:border-[#1c16cd]/20 hover:shadow-sm hover:-translate-y-1 transition-all duration-300"
            >
              {/* Ícono */}
              <div className={`${color} ${textDark ? "text-[#1c16cd]" : "text-white"} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>

              {/* Texto */}
              <h3 className="font-semibold text-xl text-[#171717] mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features