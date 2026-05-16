import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

function PartnerSignup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    shopAddress: '',
    shopPhone: '',
    shopArea: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.shopName || !form.shopAddress || !form.shopPhone || !form.shopArea) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      // Step 1 - Get products
      const productsRes = await axios.get(`${API_URL}/products`)
      const crayfish = productsRes.data.find(p => p.category === 'crayfish')
      const redOil = productsRes.data.find(p => p.category === 'red-oil')

      if (!crayfish || !redOil) {
        toast.error('Products not found. Please contact admin.')
        return
      }

      // Step 2 - Create shop
      const shopRes = await axios.post(`${API_URL}/shops`, {
        name: form.shopName,
        address: form.shopAddress,
        area: form.shopArea,
        phone: form.shopPhone,
        products: [
          {
            product: crayfish._id,
            price: crayfish.price,
            inStock: true,
            quantity: 0,
          },
          {
            product: redOil._id,
            price: redOil.price,
            inStock: true,
            quantity: 0,
          },
        ]
      })

      // Step 3 - Create user account linked to shop
      await axios.post(`${API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'shop-partner',
        shop: shopRes.data._id,
      })

      toast.success('Account created successfully! Please log in.')
      navigate('/login')

    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#C8410B]">Croil</span>
            <span className="text-2xl font-bold text-[#F5A623]">Market</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Become a Partner</h1>
          <p className="text-gray-400 mt-1">Register your shop on Croil Market</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Personal Details
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#C8410B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-2">
            Shop Details
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Enter your shop name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Area
            </label>
            <input
              type="text"
              name="shopArea"
              value={form.shopArea}
              onChange={handleChange}
              placeholder="e.g Ikeja, Lagos"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Shop Address
            </label>
            <textarea
              name="shopAddress"
              value={form.shopAddress}
              onChange={handleChange}
              placeholder="Enter your full shop address"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Phone Number
            </label>
            <input
              type="tel"
              name="shopPhone"
              value={form.shopPhone}
              onChange={handleChange}
              placeholder="Enter shop phone number"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl text-lg transition-colors mt-2 ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#C8410B] text-white hover:bg-[#a8340a]'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Partner Account'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C8410B] font-medium hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default PartnerSignup