import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import logo from "../assets/logotipo.svg"
import imgbg from "../assets/imgbg.jpg"
import { useAuth } from "../context/AuthContext"

/* Input */
const Field = ({ label, children, right }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {right}
    </div>
    {children}
  </div>
)

const inputBase = "flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#1c16cd] transition-colors"
const inputText = "flex-1 outline-none text-sm text-slate-800 placeholder:text-slate-300 bg-transparent"

// const ADMIN_EMAIL = "admin@concienciacononda.com"

//Toast para notificar login exitoso o error

const Toast = ({ mensaje, tipo }) => {
  const esError = tipo === 'error'
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold animate-[tabFade_0.2s_ease]
      ${esError ? 'bg-[#d32f2f] text-white' : 'bg-[#13da28] text-white'}`}>
      <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
        {esError ? 'error' : 'check_circle'}
      </span>
      {mensaje}
    </div>
  )
}

const Auth = ({ mode: initialMode = "login" }) => {
  const navigate    = useNavigate()
  const { login }   = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const isLogin = mode === "login"

  const mostrarToast = (mensaje, tipo = "success") => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const switchMode = (next) => {
    setMode(next)
    setShowPassword(false)
    setNombre("")
    setApellido("")
    setEmail("")
    setPassword("")
    navigate(next === "login" ? "/login" : "/registro", { replace: true })
  }


  //Maneja el submit del formulario, enviando los datos al backend y mostrando un toast con el resultado
  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isLogin) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) return mostrarToast(data.mensaje, 'error')
        mostrarToast(`Bienvenido, ${data.usuario.nombre} 👋`)
        login(data.usuario)
        setTimeout(() => {
          data.usuario.rol === 'Admin' ? navigate('/admin') : navigate('/')
        }, 1000)
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, apellido, email, password }),
        })
        const data = await res.json()
        if (!res.ok) return mostrarToast(data.mensaje, 'error')
        mostrarToast('Cuenta creada correctamente. Inicia sesión 🎉')
        setTimeout(() => switchMode('login'), 1500)
      }
    } catch (error) {
      mostrarToast('No se pudo conectar con el servidor.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Toast */}
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} />}

      {/* Formulario */}
      <div className="flex flex-col justify-center items-center px-6 py-12 bg-[#f8f8f8] order-2 lg:order-1">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="Conciencia con Onda" className="w-12 h-12" />
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b-2 border-slate-200">
            {[
              { key: "login", label: "Iniciar sesión", icon: "login" },
              { key: "registro", label: "Crear cuenta", icon: "person_add" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-bold transition-all duration-200 border-b-2 -mb-0.5
                  ${mode === key
                    ? "text-[#1c16cd]/90 border-[#1c16cd]/90"
                    : "text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300"
                  }`}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Contenido animado */}
          <div key={mode} className="animate-[tabFade_0.2s_ease]">

            {/* Heading */}
            <h1 className="font-extrabold text-3xl text-[#171717] mb-2 leading-tight">
              {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
            </h1>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {isLogin
                ? "Inicia sesión para explorar lugares accesibles en Nuevo León"
                : "Es gratis y solo toma un minuto. Únete a la comunidad accesible"
              }
            </p>

            {/* Formulario */}
            <div className="flex flex-col gap-4 min-h-105">

              {/* Nombre y Apellido — solo registro */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre">
                    <div className={inputBase}>
                      <span className="material-symbols-rounded text-slate-400 shrink-0" style={{ fontSize: "18px" }}>person</span>
                      <input type="text" placeholder="Tu nombre" className={inputText}
                        value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>
                  </Field>
                  <Field label="Apellido">
                    <div className={inputBase}>
                      <span className="material-symbols-rounded text-slate-400 shrink-0" style={{ fontSize: "18px" }}>person</span>
                      <input type="text" placeholder="Tu apellido" className={inputText}
                        value={apellido} onChange={e => setApellido(e.target.value)} />
                    </div>
                  </Field>
                </div>
              )}

              {/* Email */}
              <Field label="Correo electrónico">
                <div className={inputBase}>
                  <span className="material-symbols-rounded text-slate-400 shrink-0" style={{ fontSize: "18px" }}>mail</span>
                  <input type="email" placeholder="tu@email.com" className={inputText} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </Field>

              {/* Contraseña */}
              <Field label="Contraseña">
                <div className={inputBase}>
                  <span className="material-symbols-rounded text-slate-400 shrink-0" style={{ fontSize: "18px" }}>lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Contraseña" : "Crea una contraseña segura"}
                    className={inputText}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {/* Botón */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1c16cd]/90 hover:bg-[#1510a0] text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all hover:-translate-y-0.5 active:scale-95 mt-1"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                  {loading ? "progress_activity" : isLogin ? "login" : "person_add"}
                </span>
                {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Visuales a la derecha */}
      <div
        className="hidden lg:flex flex-col justify-end px-16 py-14 relative overflow-hidden order-1 lg:order-2"
        style={{ backgroundImage: `url(${imgbg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1c16cd]/70 via-white/30 to-transparent" />

        {/* Contenido */}
        <div className="relative z-10">

          <h2 className="font-extrabold text-4xl md:text-5xl text-[#f8f8f8] leading-tight mb-4">
            {isLogin
              ? <>Descubre Nuevo Leon<br /><span className="text-[#faea1f]">sin barreras</span></>
              : <>Únete a la <span className="text-[#faea1f]">comunidad</span></>
            }
          </h2>

          <p className="text-white text-sm mb-8 max-w-xl leading-relaxed">
            {isLogin
              ? "Explora y califica lugares accesibles verificados por la comunidad de Nuevo León"
              : "Sé parte del movimiento que está haciendo de Nuevo León un estado más accesible para todos"
            }
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div>
              <p className="font-black text-2xl text-[#faea1f]">+500</p>
              <p className="text-xs text-white font-medium">usuarios activos</p>
            </div>
            <div className="w-px h-10 bg-slate-300" />
            <div>
              <p className="font-black text-2xl text-[#faea1f]">+120</p>
              <p className="text-xs text-white font-medium">lugares verificados</p>
            </div>
            <div className="w-px h-10 bg-slate-300" />
            <div>
              <p className="font-black text-2xl text-[#faea1f]">100%</p>
              <p className="text-xs text-white font-medium">gratuito</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Auth
