import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-9xl font-bold text-gray-100">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4 -mt-8">
        Page Not Found
      </h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#C8410B] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#a8340a] transition-colors"
      >
        Go Back Home
      </button>
    </div>
  )
}

export default NotFoundPage