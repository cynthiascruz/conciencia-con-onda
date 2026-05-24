import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { lugaresService } from "../../services/lugares.service"
import { resenasService } from "../../services/resenas.services"
import { usuariosService } from "../../services/usuarios.service"
import { CATEGORIA_COLORS } from "./constants"
import AdminSidebar from "./components/AdminSidebar"
import Dashboard from "./components/Dashboard"
import Pendientes from "./components/Pendientes"
import LugaresActivos from "./components/LugaresActivos"
import Reseñas from "./components/Reseñas"
import Usuarios from "./components/Usuarios"
// import { lugaresPendientes as initialPendientes, kpis } from "../../data/admin"
// import { reseñas as reseñasData } from "../../data/lugares"

//Adaptadores para conectar con el backend
// ─── Helpers ──────────────────────────────────────────────────────────────────
const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const COLORES_AVATAR = [
  'bg-purple-500', 'bg-[#1c16cd]', 'bg-[#0097a7]', 'bg-[#d32f2f]',
  'bg-[#ff8c2a]', 'bg-[#5d4037]', 'bg-[#13da28]', 'bg-slate-500',
]

// ─── Adaptadores ──────────────────────────────────────────────────────────────
const adaptarUsuario = (u, i) => ({
  _id:            u._id,
  nombre:         u.nombre,
  apellido:       u.apellido,
  nombreCompleto: `${u.nombre} ${u.apellido}`.trim(),
  email:          u.email,
  rol:            u.rol.toLowerCase(),
  estado:         u.estado.toLowerCase(),
  iniciales:      `${u.nombre?.[0] ?? ''}${u.apellido?.[0] ?? ''}`.toUpperCase(),
  color:          COLORES_AVATAR[i % COLORES_AVATAR.length],
  fechaRegistro:  u.createdAt ?? u.fechaRegistro,
})

const adaptarLugarAdmin = (lugar) => ({
  _id: lugar._id,
  nombre: lugar.nombre,
  categoria: lugar.categoria?.nombre ?? '',
  categoriaColor: CATEGORIA_COLORS[lugar.categoria?.nombre] ?? 'bg-slate-400',
  direccion: lugar.direccion,
  descripcion: lugar.descripcion,
  imagen: lugar.url_img ?? 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
  horarioResumido: lugar.horario ?? '',
  sitioWeb: lugar.url_sitioweb ?? '',
  accesibilidad: (lugar.caracteristicas_accesibilidad ?? []).map(cap),
  estado: lugar.estado,
  activo: lugar.estado === 'Aprobado',
  verificado: lugar.estado === 'Aprobado',
  solicitadoPor: `${lugar.creadoPor_id?.nombre ?? ''} ${lugar.creadoPor_id?.apellido ?? ''}`.trim(),
  fechaSolicitud: lugar.createdAt
    ? new Date(lugar.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
    : '—',
  reseñasCount: { positivas: 0, negativas: 0 },
})

const adaptarResenaAdmin = (r) => ({
  _id: r._id,
  lugarId: r.id_lugar?._id ?? null,
  usuarioNombre: `${r.id_autor?.nombre ?? ''} ${r.id_autor?.apellido ?? ''}`.trim(),
  usuarioIniciales: `${r.id_autor?.nombre?.[0] ?? ''}${r.id_autor?.apellido?.[0] ?? ''}`.toUpperCase(),
  texto: r.descripcion,
  tipo: r.tipo.toLowerCase(),
  lugarNombre: r.id_lugar?.nombre ?? '—',
  estado: r.estado,
  fecha: new Date(r.fecha_Resena).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  }),
})

const Admin = () => {
  const navigate = useNavigate()
  const { logout, usuario: usuarioActual } = useAuth()

  // ── Datos ─────────────────────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState([])
  const [lugares, setLugares] = useState([])
  const [resenas, setResenas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [seccion, setSeccion] = useState("dashboard")

  // ── Carga inicial en paralelo ──────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const [usrs, lugs, ress] = await Promise.all([
          usuariosService.listar(),
          lugaresService.listarAdmin(),
          resenasService.listarTodasResenas(),
        ])
        setUsuarios(usrs.map(adaptarUsuario))
        setLugares(lugs.map(adaptarLugarAdmin))
        setResenas(ress.map(adaptarResenaAdmin))
      } catch (err) {
        console.error('Error cargando datos del admin:', err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // ── Datos derivados ────────────────────────────────────────────────────────
  const pendientes = useMemo(() => lugares.filter(l => l.estado === 'Pendiente'), [lugares])
  const aprobados = useMemo(() => lugares.filter(l => l.estado === 'Aprobado' || l.estado === 'Inactivo'), [lugares])
  const pendientesCount = pendientes.length
  const reseñasPendientesCount = useMemo(() => resenas.filter(r => r.estado === 'Pendiente').length, [resenas])

  // ── Callbacks — Usuarios ───────────────────────────────────────────────────
const handleGuardarUsuario = async (actualizado) => {
  const original = usuarios.find(u => u._id === actualizado._id)

  // Actualiza datos personales si hubo cambios
  const hayCambiosDatos =
    actualizado.nombre   !== original.nombre   ||
    actualizado.apellido !== original.apellido ||
    actualizado.password

  if (hayCambiosDatos) {
    const payload = {}
    if (actualizado.nombre   !== original.nombre)   payload.nombre   = actualizado.nombre
    if (actualizado.apellido !== original.apellido) payload.apellido = actualizado.apellido
    if (actualizado.password) payload.password = actualizado.password
    await usuariosService.actualizarDatos(actualizado._id, payload)
  }

  // Actualiza rol si cambió
  if (original.rol !== actualizado.rol) {
    await usuariosService.cambiarRol(actualizado._id, cap(actualizado.rol))
  }

  setUsuarios(us => us.map(u =>
    u._id === actualizado._id
      ? { ...u, ...actualizado, nombreCompleto: `${actualizado.nombre} ${actualizado.apellido}`.trim() }
      : u
  ))
}

  const handleToggleEstadoUsuario = async (id) => {
    const u = usuarios.find(u => u._id === id)
    const nuevoEstado = u.estado === 'activo' ? 'Suspendido' : 'Activo'
    await usuariosService.cambiarEstado(id, nuevoEstado)
    setUsuarios(us => us.map(u => u._id === id ? { ...u, estado: nuevoEstado.toLowerCase() } : u))
  }

  // ── Callbacks — Pendientes ─────────────────────────────────────────────────
  const handleAprobar = async (lugarEditado) => {
    await lugaresService.editar(lugarEditado._id, {
      nombre: lugarEditado.nombre,
      direccion: lugarEditado.direccion,
      descripcion: lugarEditado.descripcion,
      horario: lugarEditado.horarioResumido,
      url_img: lugarEditado.imagen,
      url_sitioweb: lugarEditado.sitioWeb,
      caracteristicas_accesibilidad: lugarEditado.accesibilidad.map(a => a.toLowerCase()),
    })
    await lugaresService.cambiarEstado(lugarEditado._id, 'Aprobado')
    setLugares(ls => ls.map(l =>
      l._id === lugarEditado._id ? { ...l, ...lugarEditado, estado: 'Aprobado', activo: true } : l
    ))
  }

  const handleRechazar = async (id) => {
    await lugaresService.cambiarEstado(id, 'Rechazado')
    setLugares(ls => ls.filter(l => l._id !== id))
  }

  // ── Callbacks — Lugares Activos ────────────────────────────────────────────
  const handleGuardarLugar = async (actualizado) => {
    await lugaresService.editar(actualizado._id, {
      nombre: actualizado.nombre,
      direccion: actualizado.direccion,
      descripcion: actualizado.descripcion,
      horario: actualizado.horarioResumido,
      url_img: actualizado.imagen,
      url_sitioweb: actualizado.sitioWeb,
      caracteristicas_accesibilidad: actualizado.accesibilidad.map(a => a.toLowerCase()),
    })
    setLugares(ls => ls.map(l => l._id === actualizado._id ? { ...l, ...actualizado } : l))
  }

  const handleToggleActivoLugar = async (id) => {
    const lugar = aprobados.find(l => l._id === id)
    const nuevoEstado = lugar.activo ? 'Inactivo' : 'Aprobado'
    await lugaresService.cambiarEstado(id, nuevoEstado)
    setLugares(ls => ls.map(l =>
      l._id === id ? { ...l, activo: !l.activo, estado: nuevoEstado } : l
    ))
  }

  // ── Callbacks — Reseñas ────────────────────────────────────────────────────
  const handleCambiarEstadoResena = async (id, nuevoEstado) => {
    await resenasService.cambiarEstado(id, nuevoEstado)
    setResenas(rs => rs.map(r => r._id === id ? { ...r, estado: nuevoEstado } : r))
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (cargando) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-rounded text-[#1c16cd] animate-spin" style={{ fontSize: "40px" }}>
          progress_activity
        </span>
        <p className="text-slate-400 text-sm font-medium">Cargando panel...</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar
        seccion={seccion}
        setSeccion={setSeccion}
        onLogout={async () => { await logout(); navigate("/login") }}
        pendientesCount={pendientesCount}
        reseñasPendientesCount={reseñasPendientesCount}
      />
      <main className="flex-1 min-w-0 px-8 py-8 overflow-y-auto">

        {seccion === "dashboard" && (
          <Dashboard
            setSeccion={setSeccion}
            pendientesCount={pendientesCount}
            reseñasPendientesCount={reseñasPendientesCount}
            usuarios={usuarios}
            pendientes={pendientes}
            lugaresAprobados={aprobados.length}
          />
        )}

        {seccion === "pendientes" && (
          <Pendientes
            pendientes={pendientes}
            onAprobar={handleAprobar}
            onRechazar={handleRechazar}
          />
        )}

        {seccion === "lugares" && (
          <LugaresActivos
            lugares={aprobados}
            resenas={resenas}
            onGuardar={handleGuardarLugar}
            onToggleActivo={handleToggleActivoLugar}
            onCambiarEstadoResena={handleCambiarEstadoResena}
          />
        )}

        {seccion === "reseñas" && (
          <Reseñas
            resenas={resenas}
            onCambiarEstado={handleCambiarEstadoResena}
          />
        )}

        {seccion === "usuarios" && (
          <Usuarios
            usuarios={usuarios}
            rolActual={usuarioActual?.rol?.toLowerCase()}
            onGuardar={handleGuardarUsuario}
            onToggleEstado={handleToggleEstadoUsuario}
          />
        )}

      </main>
    </div>
  )
}

export default Admin

