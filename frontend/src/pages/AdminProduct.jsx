import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { toast } from 'sonner';

function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        categoryName: '',
        price: '',
        description: '',
    });
    const [images, setImages] = useState([]);
    const [targetName, setTargetName] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await Api.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            toast.error('Failed to load products');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await Api.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            toast.error('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const createProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('categoryName', form.categoryName);
            formData.append('price', form.price);
            formData.append('description', form.description);

            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }

            await Api.post('/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Product created');
            setForm({ name: '', categoryName: '', price: '', description: '' });
            setImages([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Create failed');
        }
    };

    const updateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('targetName', targetName);
            formData.append('name', form.name);
            formData.append('categoryName', form.categoryName);
            formData.append('price', form.price);
            formData.append('description', form.description);

            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }

            await Api.put('/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Product updated');
            setTargetName('');
            setForm({ name: '', categoryName: '', price: '', description: '' });
            setImages([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const deleteProduct = async (name) => {
        try {
            await Api.delete('/api/products', {
                data: [name],
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Deleted ${name}`);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="flex justify-between items-center mb-6 px-4">
                <h1 className="text-3xl font-bold text-purple-700">
                    Manage Products
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Back to Products
                    </button>

                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Manage Categories
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Create / Update Form */}
            <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mb-6">
                <h2 className="text-xl font-semibold text-purple-600 mb-4">
                    Create or Update Product
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                />

                <select
                    name="categoryName"
                    value={form.categoryName}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                />

                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                />

                <div className="flex flex-wrap gap-2 mb-3">
                    {images && Array.from(images).map((file, idx) => (
                        <div key={idx} className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${idx}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Target product name (for update)"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-purple-500"
                />

                <div className="flex gap-4">
                    <button
                        onClick={createProduct}
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                    >
                        Create
                    </button>
                    <button
                        onClick={updateProduct}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-purple-600 mb-4">
                    All Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((prod) => (
                        <div key={prod._id} className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold text-indigo-700">{prod.name}</h3>
                            <p className="text-gray-600">Category: {prod.category?.name}</p>
                            <p className="text-green-600 font-bold">Price: Ksh{prod.price}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                {prod.description?.other || prod.description}
                            </p>
                            {prod.images && prod.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {prod.images.map((img, idx) => (
                                        <div key={idx} className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={img.url || img}
                                                alt={`${prod.name}-${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => deleteProduct(prod.name)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminProduct;
