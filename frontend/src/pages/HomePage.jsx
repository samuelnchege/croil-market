import { useNavigate } from 'react-router-dom'

const products = [
  {
    id: 'crayfish',
    name: 'Crayfish',
    description: 'Premium dried crayfish, rich in flavour and protein. Sourced fresh from local fishermen across Nigeria.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop',
    color: 'from-orange-50 to-orange-100',
    badge: 'Popular',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 'red-oil',
    name: 'Red Oil',
    description: 'Pure natural palm oil, locally processed and rich in colour. Perfect for all Nigerian dishes.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop',
    color: 'from-red-50 to-red-100',
    badge: 'Fresh',
    badgeColor: 'bg-red-500',
  },
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#C8410B] to-[#F5A623] text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Fresh From The Source,
            <br />
            <span className="text-yellow-200">Delivered To You</span>
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Discover premium Crayfish and Red Oil from trusted local shops near you.
            Quality guaranteed, delivered fast.
          </p>
          <button
            onClick={() => navigate('/product/crayfish')}
            className="bg-white text-[#C8410B] font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-50 transition-colors shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="w-full px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Products
          </h2>
          <p className="text-gray-500 text-lg">
            Click on a product to find shops near you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className={`bg-gradient-to-br ${product.color} rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl`}
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                  {product.badge}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C8410B] font-semibold">
                    View Available Shops →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg">
              Getting your favourite ingredients has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a Product',
                description: 'Browse our selection of premium Crayfish and Red Oil',
                icon: '🛒',
              },
              {
                step: '02',
                title: 'Pick a Shop',
                description: 'Find the nearest partner shop with the best price and availability',
                icon: '📍',
              },
              {
                step: '03',
                title: 'Get It Delivered',
                description: 'Place your order and get it delivered straight to your door',
                icon: '🚚',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-[#C8410B] font-bold text-sm mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
<footer className="w-full bg-[#1A1A1A] text-white py-10 px-8">
  <div className="max-w-6xl mx-auto text-center">
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="text-2xl font-bold text-[#C8410B]">Croil</span>
      <span className="text-2xl font-bold text-[#F5A623]">Market</span>
    </div>
    <p className="text-gray-400 mb-4">
      Connecting you to the freshest local ingredients
    </p>
    <p className="text-gray-600 text-sm">
      © 2026 Croil Market. All rights reserved. Built by{' '}
      
        <a href="https://samuelnchege.github.io/cv/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#F5A623] hover:text-white transition-colors font-medium"
      >
        FuturistTech
      </a>
    </p>
  </div>
</footer>

    </div>
  )
}

export default HomePage