import { useNavigate } from "react-router-dom"

const CTA = () => {
  const navigate = useNavigate()
  return (
    <section className="bg-[#f8f8f8] py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Card con gradiente */}
        <div className="relative overflow-hidden rounded-3xl bg-[#faea1f]/80 px-8 py-16 text-center">

          {/* Texto */}
          <h2 className="relative z-10 font-extrabold text-3xl md:text-4xl text-[#171717] leading-tight mb-4">
            Únete a la comunidad y crea<br />
            <span className="text-[#171717]">un Nuevo León accesible</span>
          </h2>
          <p className="relative z-10 text-[#171717]/90 text-regular max-w-xl mx-auto mb-8 leading-relaxed">
            Sé parte del cambio. Explora lugares accesibles o comparte tus
            descubrimientos para ayudar a otros a vivir un estado sin barreras.
          </p>

          {/* Botones */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/lugares")}
              className="flex items-center gap-2 bg-[#1c16cd]/90 hover:bg-[#15119e] text-white font-bold px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg"
            >
              <span className="material-symbols-rounded">explore</span>
              Explorar lugares
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CTA