import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { formatPrice } from '../utils/helpers'
import { Package, LogOut, Store, TrendingUp, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  'out-for-delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function PartnerPortal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [updatingProduct, setUpdatingProduct] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'shop-partner') {
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

      const shopRes = await axios.get(`${API_URL}/shops/${user.shop}`, config)
      setShop(shopRes.data)

      const ordersRes = await axios.get(`${API_URL}/orders`, config)
      const shopOrders = ordersRes.data.filter(
        order => order.shop?._id === user.shop || order.shop === user.shop
      )
      setOrders(shopOrders)

    } catch (error) {
      toast.error('Failed to load shop data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (productId, updates) => {
    try {
      setUpdatingProduct(productId)
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      }

      const updatedProducts = shop.products.map(p =>
        p.product._id === productId
          ? { ...p, ...updates }
          : p
      )

      await axios.put(`${API_URL}/shops/${user.shop}`, {
        products: updatedProducts.map(p => ({
          product: p.product._id,
          price: p.price,
          inStock: p.inStock,
          quantity: p.quantity,
        }))
      }, config)

      setShop({ ...shop, products: updatedProducts })
      toast.success('Product updated!')

    } catch (error) {
      toast.error('Failed to update product')
    } finally {
      setUpdatingProduct(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading your shop...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Partner Navbar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#C8410B]">Croil</span>
            <span className="text-xl font-bold text-[#F5A623]">Market</span>
            <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
              Partner Portal
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

        {/* Shop Header */}
        {shop && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                <Store size={32} className="text-[#C8410B]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
                <p className="text-gray-400">📍 {shop.address}</p>
                <p className="text-gray-400">📞 {shop.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-[#C8410B]" />
            </div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
              <Package size={24} className="text-purple-600" />
            </div>
            <p className="text-gray-400 text-sm">Products Listed</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{shop?.products?.length || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {['products', 'orders'].map(tab => (
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

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Products</h2>
            {shop?.products?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No products listed yet</p>
            ) : (
              <div className="flex flex-col gap-4">
                {shop?.products?.map((item) => (
                  <div
                    key={item.product._id}
                    className="border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.product.category}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Price Input */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Price (₦)</label>
                          <input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => handleUpdateProduct(item.product._id, {
                              price: Number(e.target.value)
                            })}
                            className="border border-gray-200 rounded-xl px-3 py-2 w-32 text-sm focus:outline-none focus:border-[#C8410B]"
                          />
                        </div>

                        {/* Quantity Input */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            defaultValue={item.quantity}
                            onBlur={(e) => handleUpdateProduct(item.product._id, {
                              quantity: Number(e.target.value)
                            })}
                            className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm focus:outline-none focus:border-[#C8410B]"
                          />
                        </div>

                        {/* Stock Toggle */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">In Stock</label>
                          <button
                            onClick={() => handleUpdateProduct(item.product._id, {
                              inStock: !item.inStock
                            })}
                            disabled={updatingProduct === item.product._id}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                              item.inStock
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b">
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Items</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b last:border-0">
                        <td className="py-4">
                          <p className="font-medium text-gray-800">{order.customer.name}</p>
                          <p className="text-sm text-gray-400">{order.customer.phone}</p>
                        </td>
                        <td className="py-4 text-gray-600">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-sm">
                              {item.product?.name} x{item.quantity}
                            </p>
                          ))}
                        </td>
                        <td className="py-4 font-bold text-[#C8410B]">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 text-sm">
                          {order.customer.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default PartnerPortal