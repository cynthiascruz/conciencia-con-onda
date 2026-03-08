import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sites from './pages/Sites'
import Auth from './pages/Auth'
import Admin from './pages/Admin'

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Navbar y Footer */}
        <Route path="/" element={<Layout />}>
          <Route index          element={<Home />}  />
          <Route path="lugares" element={<Sites />} />
        </Route>

        {/* Con Navbar, sin Footer */}
        <Route path="/login"    element={<><Navbar /><Auth mode="login"    /></>} />
        <Route path="/registro" element={<><Navbar /><Auth mode="registro" /></>} />

        {/* Sin Navbar ni Footer */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App