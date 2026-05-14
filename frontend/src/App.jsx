import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import { Toaster } from 'react-hot-toast'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:category" element={<ProductPage />} />
        <Route path="/shops/:productId" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </div>
  )
}

export default App