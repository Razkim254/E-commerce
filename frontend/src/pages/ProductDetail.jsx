import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ import navigate
import Api from '../Api';
import { toast } from 'sonner';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); // ✅ hook for navigation
    const [product, setProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await Api.get(`/api/products/id/${id}`);
                setProduct(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load product');
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p className="p-6 text-gray-600">Loading...</p>;

    const images = product.images || [];

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* ✅ Back button at top center */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Back to Products
                </button>
            </div>

            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">{product.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image carousel */}
                <div className="relative">
                    {images.length > 0 ? (
                        <div className="relative w-full aspect-[4/3] rounded overflow-hidden shadow">
                            <img
                                src={images[currentIndex]?.url}
                                alt={`${product.name} ${currentIndex + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Prev button */}
                            <button
                                onClick={prevImage}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800"
                            >
                                ‹
                            </button>
                            {/* Next button */}
                            <button
                                onClick={nextImage}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800"
                            >
                                ›
                            </button>
                            {/* Dots indicator */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-400'
                                            }`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center rounded">
                            <span className="text-gray-500">No images</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <p className="text-gray-600 mb-2">
                        <span className="font-semibold">Category:</span> {product.category?.name}
                    </p>
                    <p className="text-green-600 font-bold mb-4 text-xl">Ksh{product.price}</p>

                    {product.description && (
                        <div className="space-y-2 text-gray-700">
                            {product.description.size && <p>Size: {product.description.size}</p>}
                            {product.description.model && <p>Model: {product.description.model}</p>}
                            {product.description.version && <p>Version: {product.description.version}</p>}
                            {product.description.other && <p>{product.description.other}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
