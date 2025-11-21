import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAdd }) {
    return (
        <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition flex flex-col text-sm">
            {/* ✅ Clickable image that links to product detail */}
            <Link to={`/product/${product._id}`}>
                <div className="w-full aspect-[4/3] mb-2 rounded overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url} // ✅ use .url from Cloudinary object
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* ✅ Product info */}
            <h2 className="text-base font-semibold text-blue-600 truncate">{product.name}</h2>
            <p className="text-gray-500 mb-1">{product.category?.name}</p>
            <p className="text-green-600 font-bold mb-2">Ksh{product.price}</p>

            {/* ✅ Add to Cart button */}
            <button
                onClick={onAdd}
                className="mt-auto bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 w-full text-sm"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
