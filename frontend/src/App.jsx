import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sites from './pages/Sites'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Perfil from './pages/Perfil'

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
            <Route index          element={<Home />}   />
            <Route path="lugares" element={<Sites />}  />
            <Route path="perfil"  element={<Perfil />} />
          </Route>

          {/* Con Navbar, sin Footer */}
          <Route element={<LayoutSinFooter />}>
            <Route path="/login"    element={<Auth mode="login"    />} />
            <Route path="/registro" element={<Auth mode="registro" />} />
          </Route>

          {/* Sin Navbar ni Footer */}
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
