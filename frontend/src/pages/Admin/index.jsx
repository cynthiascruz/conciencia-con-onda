import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { lugaresPendientes as initialPendientes, kpis } from "../../data/admin"
import { reseñas as reseñasData } from "../../data/lugares"
import AdminSidebar from "./components/AdminSidebar"
import Dashboard from "./components/Dashboard"
import Pendientes from "./components/Pendientes"
import LugaresActivos from "./components/LugaresActivos"
import Reseñas from "./components/Reseñas"
import Usuarios from "./components/Usuarios"

const Admin = () => {
  const navigate                                          = useNavigate()
  const [seccion, setSeccion]                             = useState("dashboard")
  const [pendientesCount, setPendientesCount]             = useState(initialPendientes.length)
  const [reseñasPendientesCount, setReseñasPendientes]   = useState(
    reseñasData.filter(r => r.estado === "Pendiente").length
  )

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar
        seccion={seccion}
        setSeccion={setSeccion}
        onLogout={() => navigate("/login")}
        pendientesCount={pendientesCount}
        reseñasPendientesCount={reseñasPendientesCount}
      />
      <main className="flex-1 min-w-0 px-8 py-8 overflow-y-auto">
        {seccion === "dashboard"  && (
          <Dashboard
            setSeccion={setSeccion}
            pendientesCount={pendientesCount}
            reseñasPendientesCount={reseñasPendientesCount}
          />
        )}
        {seccion === "pendientes" && <Pendientes onCountChange={setPendientesCount} />}
        {seccion === "lugares"    && <LugaresActivos />}
        {seccion === "reseñas"    && <Reseñas onPendingCountChange={setReseñasPendientes} />}
        {seccion === "usuarios"   && <Usuarios />}
      </main>
    </div>
  )
}

export default Admin
