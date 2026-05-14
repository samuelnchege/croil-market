import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api'

function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error('Please fill in all fields')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setLoading(true)

      const shopId = items[0].shopId

      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        shop: shopId,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      }

      const res = await axios.post(`${API_URL}/orders`, orderData)
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order/${res.data._id}`)

    } catch (error) {
      console.error(error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-[#C8410B] text-white font-bold px-8 py-3 rounded-xl"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#C8410B] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Delivery Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Delivery Details
              </h2>

              <div className="flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
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

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your full delivery address"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8410B] transition-colors resize-none"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.shopId}`}
                    className="flex justify-between text-sm text-gray-500"
                  >
                    <span>{item.productName} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-[#C8410B]">{formatPrice(totalAmount)}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Delivery fee will be confirmed by the shop
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full font-bold py-4 rounded-xl text-lg transition-colors ${
                  loading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C8410B] text-white hover:bg-[#a8340a]'
                }`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                By placing your order you agree to our terms and conditions
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckoutPage