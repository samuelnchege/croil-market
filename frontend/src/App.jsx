import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import PartnerPortal from './pages/PartnerPortal'
import { Toaster } from 'react-hot-toast'
import NotFoundPage from './pages/NotFoundPage'

const noNavbarRoutes = ['/admin', '/partner', '/login']

function App() {
  const hideNavbar = noNavbarRoutes.some(route =>
    window.location.pathname.startsWith(route)
  )

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <Toaster position="top-right" />
      {!hideNavbar && <Navbar />}
      <div style={{
        width: '100%',
        paddingLeft: hideNavbar ? '0' : '2rem',
        paddingRight: hideNavbar ? '0' : '2rem',
        boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:category" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderTrackingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute role="shop-partner">
                <PartnerPortal />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App