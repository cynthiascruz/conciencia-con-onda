import { useState } from "react"

const quickTags = [
  { label: "Restaurantes", color: "bg-[#ff8c2a] hover:bg-[#e07820]" },
  { label: "Museos",       color: "bg-[#7b1fa2] hover:bg-[#6a1b91]" },
  { label: "Parques",      color: "bg-[#13da28] hover:bg-[#10c223]"  },
  { label: "Cafeterías",   color: "bg-[#d32f2f] hover:bg-[#b71c1c]"  },
]

const Hero = () => {
  const [query, setQuery] = useState("")

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">

      {/* Video */}
      <div className="absolute inset-0 -z-10">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videofifamty.mp4" type="video/mp4" />
        </video>

        {/* Overlay oscuro para que el texto gane siempre */}
        <div className="absolute inset-0 bg-[#0a0820]/65" />
        {/* Gradiente extra abajo */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0820]/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1a18cd]/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full mb-8">
          <span className="font-medium text-xs uppercase tracking-[0.2em]">Conciencia con Onda</span>
        </div>

        {/* Texto primario */}
        <h1 className="font-black leading-[0.9] tracking-tight mb-6 text-[clamp(4rem,9vw,8rem)]">
          <span className="block text-white">
            Explora Nuevo León
          </span>
          <span className="block text-[#fff12e] mt-2">
            sin barreras.
          </span>
        </h1>

        {/* Texto secundario */}
        <p className="text-white/90 text-lg max-w-xl mb-10 leading-relaxed font-medium">
          Más de <span className="text-[#ff8c2a] font-bold">50 lugares verificados</span> por la comunidad.
          <br /> 
          Para que nadie se quede fuera.
        </p>

        {/* Buscador */}
        <div className="w-full max-w-xl mb-6">
          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white focus-within:border-[#faea1f] transition-all duration-300">
            <div className="flex items-center flex-1 px-4 gap-4">
              <span className="material-icons-round text-[#1c16cd]">search</span>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca restaurantes, museos, parques..." className="w-full py-4 text-slate-800 placeholder:text-slate-400 outline-none bg-transparent font-medium"/>
            </div>
          </div>
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-14">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mr-1">
            Sugerencias:
          </span>
          {quickTags.map(tag => (
            <button
              key={tag.label}
              onClick={() => setQuery(tag.label)}
              className={`${tag.color} text-white text-xs font-bold px-5 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>

    </section>
  )
}

export default Hero