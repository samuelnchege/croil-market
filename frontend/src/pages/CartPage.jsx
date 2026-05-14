import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()

  const handleRemove = (productId, shopId, productName) => {
    removeFromCart(productId, shopId)
    toast.success(`${productName} removed from cart`)
  }

  const handleQuantityChange = (productId, shopId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) {
      removeFromCart(productId, shopId)
      return
    }
    updateQuantity(productId, shopId, newQuantity)
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center py-20">
        <ShoppingBag size={80} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-8">
          Add some products to get started
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#C8410B] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#a8340a] transition-colors"
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#C8410B] transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          <span className="bg-[#C8410B] text-white text-sm font-bold px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.shopId}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.productName}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      From: {item.shopName}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.shopId, item.quantity, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-gray-800 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.shopId, item.quantity, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-bold text-[#C8410B] text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.productId, item.shopId, item.productName)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart()
                toast.success('Cart cleared')
              }}
              className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors self-start"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.shopId}`} className="flex justify-between text-sm text-gray-500">
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
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#C8410B] text-white font-bold py-4 rounded-xl hover:bg-[#a8340a] transition-colors text-lg"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartPage