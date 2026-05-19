import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sites from './pages/Sites'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Perfil from './pages/Perfil'
import PrivateRoute from './components/PrivateRoute'

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
)

const LayoutSinFooter = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Con Navbar y Footer */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="lugares" element={<Sites />} />

            {/* Requiere sesión */}
            <Route element={<PrivateRoute />}>
              <Route path="perfil" element={<Perfil />} />
            </Route>
          </Route>

          {/* Con Navbar y sin Footer */}
          <Route element={<LayoutSinFooter />}>
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/registro" element={<Auth mode="registro" />} />
          </Route>

          {/* Sin Navbar ni Footer, requiere sesión y rol Admin */}
          <Route element={<PrivateRoute rol="Admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
