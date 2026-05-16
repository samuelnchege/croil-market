import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { formatPrice } from '../utils/helpers'
import {
  ShoppingBag, Store, Package, TrendingUp,
  LogOut, ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL

const statusOptions = ['pending', 'confirmed', 'out-for-delivery', 'delivered', 'cancelled']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  'out-for-delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      }
      const [ordersRes, shopsRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`, config),
        axios.get(`${API_URL}/shops`, config),
        axios.get(`${API_URL}/products`, config),
      ])
      setOrders(ordersRes.data)
      setShops(shopsRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      }
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, config)
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success('Order status updated!')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-orange-50 text-[#C8410B]',
    },
    {
      label: 'Partner Shops',
      value: shops.length,
      icon: Store,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Products',
      value: products.length,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
  ]

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Admin Navbar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#C8410B]">Croil</span>
            <span className="text-xl font-bold text-[#F5A623]">Market</span>
            <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {['overview', 'orders', 'shops', 'products'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#C8410B] text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                          <Icon size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No orders yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-400 text-sm border-b">
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Shop</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order._id} className="border-b last:border-0">
                              <td className="py-4">
                                <p className="font-medium text-gray-800">{order.customer.name}</p>
                                <p className="text-sm text-gray-400">{order.customer.email}</p>
                              </td>
                              <td className="py-4 text-gray-600">{order.shop?.name}</td>
                              <td className="py-4 font-bold text-[#C8410B]">{formatPrice(order.totalAmount)}</td>
                              <td className="py-4">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">All Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No orders yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm border-b">
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Shop</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id} className="border-b last:border-0">
                            <td className="py-4">
                              <p className="font-medium text-gray-800">{order.customer.name}</p>
                              <p className="text-sm text-gray-400">{order.customer.phone}</p>
                              <p className="text-sm text-gray-400">{order.customer.address}</p>
                            </td>
                            <td className="py-4 text-gray-600">{order.shop?.name}</td>
                            <td className="py-4 font-bold text-[#C8410B]">{formatPrice(order.totalAmount)}</td>
                            <td className="py-4">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:border-[#C8410B] cursor-pointer"
                                >
                                  {statusOptions.map(status => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Shops Tab */}
            {activeTab === 'shops' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Partner Shops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shops.map(shop => (
                    <div key={shop._id} className="border border-gray-100 rounded-2xl p-5">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{shop.name}</h3>
                      <p className="text-gray-400 text-sm mb-1">📍 {shop.address}</p>
                      <p className="text-gray-400 text-sm mb-4">📞 {shop.phone}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          {shop.products.length} products
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

           {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Manage Product Prices
                </h2>
                <div className="flex flex-col gap-4">
                  {products.map(product => (
                    <div
                      key={product._id}
                      className="border border-gray-100 rounded-2xl p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Package size={28} className="text-[#C8410B]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                            <p className="text-gray-400 text-sm">{product.category}</p>
                            <p className="text-[#C8410B] font-bold mt-1">
                              Current Price: {formatPrice(product.price || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              Set New Price (₦)
                            </label>
                            <input
                              type="number"
                              defaultValue={product.price || 0}
                              id={`price-${product._id}`}
                              className="border border-gray-200 rounded-xl px-3 py-2 w-36 text-sm focus:outline-none focus:border-[#C8410B]"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              const newPrice = document.getElementById(`price-${product._id}`).value
                              try {
                                const config = {
                                  headers: { Authorization: `Bearer ${user.token}` }
                                }
                                await axios.put(`${API_URL}/products/${product._id}`, {
                                  price: Number(newPrice)
                                }, config)
                                setProducts(products.map(p =>
                                  p._id === product._id ? { ...p, price: Number(newPrice) } : p
                                ))
                                toast.success(`${product.name} price updated!`)
                              } catch (error) {
                                toast.error('Failed to update price')
                              }
                            }}
                            className="bg-[#C8410B] text-white font-semibold px-6 py-2 rounded-xl hover:bg-[#a8340a] transition-colors mt-4"
                          >
                            Update Price
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard