import logo from '../assets/logotipo.svg'
import { Instagram, Facebook, Twitter, Mail } from "lucide-react"

const socialIcons = [
  { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
  { icon: <Facebook  className="w-4 h-4" />, label: "Facebook"  },
  { icon: <Mail      className="w-4 h-4" />, label: "Mail"      },
]

const footerLinks = [
  {
    title: "Explorar",
    color: "text-[#faea1f]",
    links: ["Categorías", "Destacados", "Nuevos Lugares"],
  },
  {
    title: "Recursos",
    color: "text-[#ff8c2a]",
    links: ["Cómo Funciona", "Guía de Accesibilidad", "Preguntas Frecuentes", "Noticias"],
  },
  {
    title: "Proyecto",
    color: "text-[#13da28]",
    links: ["Sobre Nosotros", "Contacto", "Colaboradores"],
  },
]

const Footer = () => {
  return (
    <footer className="bg-[#1a18cd]/90 px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Marca */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <a href="/" className="group flex items-center transition-all">
                <img
                  src={logo}
                  alt="Conciencia con Onda"
                  className="h-10 w-10 md:h-11 md:w-11 group-hover:rotate-12 transition-all duration-500 ease-out"
                />
              </a>
              <div>
                <p className="font-bold text-white text-sm">Conciencia con Onda</p>
                <p className="text-white/50 text-xs">Nuevo León Accesible</p>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Plataforma de accesibilidad urbana creada por estudiantes.
              Descubre lugares 100% accesibles en Nuevo León.
            </p>

            {/* Redes sociales */}
            <div className="flex gap-3">
              {socialIcons.map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/60 transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(({ title, color, links }) => (
            <div key={title}>
              <h4 className={`${color} font-bold text-sm uppercase tracking-wider mb-5`}>
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="border-t border-white/30 pt-8 flex justify-center">
          <p className="text-white/60 text-xs">
            2026 Conciencia con Onda. Hecho con ♥ en Monterrey.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer