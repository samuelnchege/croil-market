import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#C8410B]">Croil</span>
          <span className="text-2xl font-bold text-[#F5A623]">Market</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-600 hover:text-[#C8410B] font-medium transition-colors">
            Home
        </Link>
        <Link to="/product/crayfish" className="text-gray-600 hover:text-[#C8410B] font-medium transition-colors">
            Crayfish
        </Link>
        <Link to="/product/red-oil" className="text-gray-600 hover:text-[#C8410B] font-medium transition-colors">
            Red Oil
        </Link>
        {user ? (
            <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">{user.name}</span>
            {user.role === 'admin' && (
                <Link to="/admin" className="text-[#C8410B] font-medium">
                Dashboard
                </Link>
            )}
            {user.role === 'shop-partner' && (
                <Link to="/partner" className="text-[#C8410B] font-medium">
                My Shop
                </Link>
            )}
            <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 font-medium transition-colors"
            >
                Logout
            </button>
            </div>
        ) : (
            <Link
            to="/login"
            className="bg-[#C8410B] text-white font-bold px-5 py-2 rounded-xl hover:bg-[#a8340a] transition-colors"
            >
            Login
            </Link>
        )}
        </div>

        {/* Cart Icon */}
        <button
          onClick={() => navigate('/cart')}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart size={24} className="text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C8410B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#C8410B] font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/product/crayfish"
            className="text-gray-600 hover:text-[#C8410B] font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Crayfish
          </Link>
          <Link
            to="/product/red-oil"
            className="text-gray-600 hover:text-[#C8410B] font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Red Oil
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar