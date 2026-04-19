const steps = [
  {
    number: "01",
    icon: <span className="material-symbols-rounded">search</span>,
    color: "bg-[#1c16cd]/90",
    borderColor: "border-[#1c16cd]/90",
    title: "Busca",
    desc: "Escribe el tipo de lugar que buscas o usa nuestras categorías.",
  },
  {
    number: "02",
    icon: <span className="material-symbols-rounded">tune</span>,
    color: "bg-[#ff8c2a]/90",
    borderColor: "border-[#ff8c2a]/90",
    title: "Filtra",
    desc: "Selecciona las características de accesibilidad que necesitas.",
  },
  {
    number: "03",
    icon: <span className="material-symbols-rounded">location_on</span>,
    color: "bg-[#13da28]/90",
    borderColor: "border-[#13da28]/90",
    title: "Encuentra",
    desc: "Explora los resultados con todos los detalles.",
  },
  {
    number: "04",
    icon: <span className="material-symbols-rounded">rate_review</span>,
    color: "bg-[#7b1fa2]/90",
    borderColor: "border-[#7b1fa2]/90",
    title: "Comparte",
    desc: "Deja tu reseña y colabora con otros a encontrar lugares accesibles.",
  },
]

const HowItWorks = () => {
  return (
    <section className="bg-[#f8f8f8] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-[#ff8c2a]/90 text-white text-[14px] font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            Cómo funciona
          </span>
          <h2 className="font-extrabold text-[clamp(2rem,5vw,3.0rem)] leading-tight tracking-tight text-[#171717]">
            Encuentra tu lugar ideal en{" "}
            <span className="text-[#ff8c2a]">4 pasos</span>
          </h2>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map(({ number, icon, color, borderColor, title, desc }, i) => (
            <div key={i} className="relative group">
              
              {/* Línea */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[65%] w-full h-[3px] bg-gradient-to-r from-[#1c16cd]/20 to-[#ff8c2a]/20 z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                
                <div className="relative mb-8">
                  <div className={`${color} w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                  </div>
                  
                  <div className={`absolute -top-2 -right-2 w-10 h-10 bg-white border-4 ${borderColor} rounded-full flex items-center justify-center`}>
                    <span className="text-sm font-bold text-[#171717]">{number}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-2xl text-[#171717] mb-3 tracking-tight">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm font-regular leading-relaxed max-w-[300px]">
                  {desc}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks