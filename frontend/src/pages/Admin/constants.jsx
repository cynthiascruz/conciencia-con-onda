export const Icon = ({ name, size = 18 }) => (
  <span className="material-symbols-rounded" style={{ fontSize: `${size}px` }}>{name}</span>
)

export const CATEGORIAS = ["Museo", "Parque", "Restaurante", "Cafetería", "Estadio", "Centro Comercial", "Hotel"]

export const CATEGORIA_COLORS = {
  "Museo":            "bg-[#7b1fa2]",
  "Parque":           "bg-[#13da28]",
  "Restaurante":      "bg-[#ff8c2a]",
  "Cafetería":        "bg-[#d32f2f]",
  "Estadio":          "bg-[#1c16cd]",
  "Centro Comercial": "bg-[#0097a7]",
  "Hotel":            "bg-[#5d4037]",
}

export const TAGS_ACCESIBILIDAD = [
  "Rampa de acceso", "Elevador", "Baño accesible", "Silla de ruedas",
  "Estacionamiento accesible", "Personal capacitado", "Entrada accesible",
  "Menú braille", "Personal LSM", "Senderos accesibles", "Audiolibros",
  "Señalización braille", "Juegos inclusivos", "Habitaciones adaptadas",
  "Transporte accesible", "Espacio amplio",
]

export const navItems = [
  { key: "dashboard",  label: "Dashboard",  icon: "dashboard"   },
  { key: "pendientes", label: "Pendientes", icon: "schedule"    },
  { key: "lugares",    label: "Lugares",    icon: "location_on" },
  { key: "reseñas",    label: "Reseñas",    icon: "rate_review" },
  { key: "usuarios",   label: "Usuarios",   icon: "group"       },
]
