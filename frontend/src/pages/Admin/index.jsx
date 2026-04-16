import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { lugaresPendientes as initialPendientes } from "../../data/admin"
import AdminSidebar from "./components/AdminSidebar"
import Dashboard from "./components/Dashboard"
import Pendientes from "./components/Pendientes"
import LugaresActivos from "./components/LugaresActivos"
import Usuarios from "./components/Usuarios"

const Admin = () => {
  const navigate                              = useNavigate()
  const [seccion, setSeccion]                 = useState("dashboard")
  const [pendientesCount, setPendientesCount] = useState(initialPendientes.length)

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar
        seccion={seccion}
        setSeccion={setSeccion}
        onLogout={() => navigate("/login")}
        pendientesCount={pendientesCount}
      />
      <main className="flex-1 px-8 py-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-slate-400 font-regular">Panel de administración</p>
            <p className="font-extrabold text-slate-900 text-sm">Bienvenido, Admin</p>
          </div>
        </div>
        {seccion === "dashboard"  && <Dashboard setSeccion={setSeccion} pendientesCount={pendientesCount} />}
        {seccion === "pendientes" && <Pendientes onCountChange={setPendientesCount} />}
        {seccion === "lugares"    && <LugaresActivos />}
        {seccion === "usuarios"   && <Usuarios />}
      </main>
    </div>
  )
}

export default Admin
