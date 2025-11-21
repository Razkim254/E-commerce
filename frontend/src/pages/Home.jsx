import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-blue-700 mb-2">Welcome to ShopEase 🛍️</h1>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                Your one-stop shop for quality products, seamless checkout, and fast delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* Card: Browse Products */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold text-blue-600 mb-2">Browse Products</h2>
                    <p className="text-gray-500 mb-4">Explore categories and discover great deals.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Start Shopping
                    </Link>
                </div>

                {/* Card: Login */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold text-green-600 mb-2">Already a Member?</h2>
                    <p className="text-gray-500 mb-4">Log in to access your cart and orders.</p>
                    <Link to="/login" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Login
                    </Link>
                </div>

                {/* Card: Register */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold text-purple-600 mb-2">New to ShopEase?</h2>
                    <p className="text-gray-500 mb-4">Create an account and start shopping today.</p>
                    <Link to="/register" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
