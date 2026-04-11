const stats = [
  { number: "150+",  label: "Lugares Verificados", color: "text-[#faea1f]/90" },
  { number: "10K+",  label: "Usuarios Activos",    color: "text-[#ff8c2a]/90" },
  { number: "500+",  label: "Reseñas Publicadas",  color: "text-[#13da28]/90" },
  { number: "100%",  label: "Gratuito",            color: "text-[#faea1f]/90" },
]

const Stats = () => {
  return (
    <section className="bg-[#1c16cd]/90 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-extrabold text-[clamp(2rem,5vw,3.0rem)] text-white mb-3">
            Nuestro <span className="text-[#faea1f]">impacto</span>
          </h2>
          <p className="text-white/80 text-base max-w-lg mx-auto">
            Juntos estamos construyendo una ciudad más accesible e inclusiva para todos.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ number, label, color }) => (
            <div key={label}>
              <div className={`${color} font-extrabold text-5xl md:text-6xl leading-none mb-2`}>
                {number}
              </div>
              <div className="text-white/80 text-xs font-bold uppercase tracking-widest">
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Stats