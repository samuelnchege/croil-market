import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Star, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api'

const productInfo = {
  crayfish: {
    name: 'Crayfish',
    description: 'Premium dried crayfish, rich in flavour and protein. Sourced fresh from local fishermen across Nigeria.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop',
    color: 'from-orange-500 to-orange-600',
  },
  'red-oil': {
    name: 'Red Oil',
    description: 'Pure natural palm oil, locally processed and rich in colour. Perfect for all Nigerian dishes.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop',
    color: 'from-red-500 to-red-600',
  },
}

function ProductPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [shops, setShops] = useState([])
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const info = productInfo[category]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const productsRes = await axios.get(`${API_URL}/products`)
        const matched = productsRes.data.find(p => p.category === category)

        if (!matched) {
          setLoading(false)
          return
        }

        setProduct(matched)

        const shopsRes = await axios.get(`${API_URL}/shops/by-product/${matched._id}`)
        setShops(shopsRes.data)

      } catch (error) {
        console.error(error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category])

  const handleAddToCart = (shop) => {
    const shopProduct = shop.products.find(
      p => p.product._id === product._id
    )
    addToCart({
      productId: product._id,
      shopId: shop._id,
      productName: product.name,
      shopName: shop.name,
      price: shopProduct.price,
      image: info.image,
    })
    toast.success(`${product.name} added to cart!`)
  }

  if (!info) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-[#C8410B]">
          Go back home
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* Product Hero */}
      <div className={`bg-gradient-to-r ${info.color} text-white py-16`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={info.image}
              alt={info.name}
              className="w-full md:w-80 h-64 object-cover rounded-2xl shadow-xl"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {info.name}
              </h1>
              <p className="text-white/90 text-lg max-w-xl">
                {info.description}
              </p>
              <div className="mt-6 flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full">
                <ShoppingBag size={18} />
                <span className="font-medium">
                  {loading ? 'Loading...' : `${shops.length} shops available`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shops List */}
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Partner Shops Carrying {info.name}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No shops available for this product yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map(shop => {
              const shopProduct = shop.products.find(
                p => p.product._id === product?._id
              )
              return (
                <div
                  key={shop._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
                >
                  {/* Shop Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{shop.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">4.5</span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      shopProduct?.inStock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {shopProduct?.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-[#C8410B]">
                      {formatPrice(shopProduct?.price)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">per unit</span>
                  </div>

                  {/* Phone */}
                  <p className="text-sm text-gray-500 mb-4">
                    📞 {shop.phone}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(shop)}
                    disabled={!shopProduct?.inStock}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      shopProduct?.inStock
                        ? 'bg-[#C8410B] text-white hover:bg-[#a8340a]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {shopProduct?.inStock ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage