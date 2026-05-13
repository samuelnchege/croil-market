import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:category" element={<ProductPage />} />
      <Route path="/shops/:productId" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order/:id" element={<OrderTrackingPage />} />
    </Routes>
  )
}

export default App