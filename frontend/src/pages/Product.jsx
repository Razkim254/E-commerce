import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { FaShoppingCart, FaCog, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CategoryDropdown from '../components/CategoryDropdown';
import TopRightLogout from '../components/TopRightLogout'; // ✅ now local, not global

function Product() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { cart, addToCart } = useCart(); // ✅ include cart state

    // ✅ calculate cart item count safely (raw products)
    const itemCount = cart.length;

    const fetchProducts = async () => {
        try {
            const res = await Api.get('/api/products'); // ✅ Correct path
            setProducts(res.data);
        } catch (err) {
            toast.error('Failed to load products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            category === 'all' || product.category?.name === category;
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 relative">
            {/* Unified top-right toolbar */}
            <div className="fixed top-4 right-32 flex gap-4 z-50">
                <button
                    onClick={() => navigate('/orders')}
                    className="relative bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    title="View Cart"
                >
                    <FaShoppingCart size={20} />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                            {itemCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => navigate('/settings')}
                    className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700"
                    title="Settings"
                >
                    <FaCog size={20} />
                </button>
                <TopRightLogout /> {/* ✅ logout sits alongside cart/settings */}
            </div>

            <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
                ShopEase Products
            </h1>

            {/* Search and Category */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center border rounded px-3 w-full sm:w-1/2">
                    <FaSearch className="text-blue-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 outline-none bg-transparent"
                    />
                </div>

                {/* ✅ Dynamic dropdown */}
                <CategoryDropdown
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAdd={() => {
                                addToCart(product);
                                toast.success(`${product.name} added to cart`);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-10">No products found.</p>
            )}
        </div>
    );
}

export default Product;
