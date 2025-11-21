import React, { useState, useEffect } from 'react';
import {
    getCategories,
    createCategory,
    updateCategoryByName,
    deleteCategoryByName
} from '../Api'; // ✅ import helpers
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [editName, setEditName] = useState('');
    const [updatedName, setUpdatedName] = useState('');

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (err) {
            toast.error('Failed to load categories');
        }
    };

    const createCategoryHandler = async () => {
        if (!newName) return toast.error('Name required');
        try {
            await createCategory({ name: newName }, token);
            toast.success('Category created');
            setNewName('');
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Create failed');
        }
    };

    const updateCategoryHandler = async () => {
        if (!editName || !updatedName) return toast.error('Both names required');
        try {
            await updateCategoryByName(editName, { name: updatedName }, token);
            toast.success('Category updated');
            setEditName('');
            setUpdatedName('');
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const deleteCategoryHandler = async (name) => {
        try {
            await deleteCategoryByName(name, token);
            toast.success(`Deleted ${name}`);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
            {/* Top Center Button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Back to Products
                </button>
            </div>

            <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
                Manage Categories
            </h1>

            {/* Create + Update side by side */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
                {/* Create */}
                <div className="bg-white p-4 rounded shadow-md w-full md:w-1/2">
                    <h2 className="text-xl font-semibold text-orange-600 mb-4">Create Category</h2>
                    <input
                        type="text"
                        placeholder="New category name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <button
                        onClick={createCategoryHandler}
                        className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                    >
                        Create
                    </button>
                </div>

                {/* Update */}
                <div className="bg-white p-4 rounded shadow-md w-full md:w-1/2">
                    <h2 className="text-xl font-semibold text-orange-600 mb-4">Update Category</h2>
                    <input
                        type="text"
                        placeholder="Current name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="New name"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <button
                        onClick={updateCategoryHandler}
                        className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* List + Delete */}
            <div className="max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-orange-600 mb-4">All Categories</h2>
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li
                            key={cat._id}
                            className="flex justify-between items-center bg-white p-3 rounded shadow"
                        >
                            <span className="text-gray-700">{cat.name}</span>
                            <button
                                onClick={() => deleteCategoryHandler(cat.name)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminCategory;
