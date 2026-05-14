import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatPrice } from '../utils/helpers'
import { ArrowLeft, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api'

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Package },
]

function OrderTrackingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/orders/${id}`)
        setOrder(res.data)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(s => s.key === status)
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading your order...
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Order not found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-[#C8410B] text-white font-bold px-8 py-3 rounded-xl"
        >
          Go Home
        </button>
      </div>
    )
  }

  const currentStatusIndex = getStatusIndex(order.status)

  return (
    <div className="w-full py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#C8410B] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order Tracking</h1>
        </div>

        {/* Order ID */}
        <div className="bg-[#C8410B] text-white rounded-2xl p-6 mb-6">
          <p className="text-orange-200 text-sm mb-1">Order ID</p>
          <p className="font-mono font-bold text-lg">{order._id}</p>
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-orange-200 text-sm">Total Amount</p>
              <p className="font-bold text-2xl">{formatPrice(order.totalAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-orange-200 text-sm">Payment</p>
              <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                order.paymentStatus === 'paid'
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-400 text-yellow-900'
              }`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        {order.status !== 'cancelled' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              Order Status
            </h2>
            <div className="relative">

              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0" />
              <div
                className="absolute top-6 left-6 h-0.5 bg-[#C8410B] z-0 transition-all duration-500"
                style={{
                  width: currentStatusIndex === 0
                    ? '0%'
                    : `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`
                }}
              />

              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-[#C8410B] text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-xs font-medium text-center max-w-16 ${
                        isCompleted ? 'text-[#C8410B]' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <XCircle size={32} className="text-red-500" />
            <div>
              <h3 className="font-bold text-red-700">Order Cancelled</h3>
              <p className="text-red-500 text-sm">This order has been cancelled</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Items Ordered
          </h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product?.name || 'Product'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-[#C8410B]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Shop Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Delivery Details
            </h2>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {order.customer.name}</p>
              <p><span className="font-medium">Email:</span> {order.customer.email}</p>
              <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
              <p><span className="font-medium">Address:</span> {order.customer.address}</p>
            </div>
          </div>

          {/* Shop Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Shop Details
            </h2>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p><span className="font-medium">Shop:</span> {order.shop?.name}</p>
              <p><span className="font-medium">Address:</span> {order.shop?.address}</p>
              <p><span className="font-medium">Phone:</span> {order.shop?.phone}</p>
            </div>
          </div>

        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-[#C8410B] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#a8340a] transition-colors"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderTrackingPage