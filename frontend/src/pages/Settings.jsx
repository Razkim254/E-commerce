import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [emailToPromote, setEmailToPromote] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const updateProfile = async () => {
        try {
            const res = await Api.patch(
                '/users/me',
                { name, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Profile updated');
            setName('');
            setPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        toast.info('Logged out');
        navigate('/');
    };

    const promoteUser = async () => {
        try {
            await Api.post(
                '/users/promote',
                { email: emailToPromote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${emailToPromote} promoted to admin`);
            setEmailToPromote('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Promotion failed');
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await Api.get('/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await Api.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAdmin(res.data.isAdmin);
                if (res.data.isAdmin) fetchOrders();
            } catch (err) {
                toast.error('Failed to verify role');
            }
        };
        checkAdmin();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4">
            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Settings</h1>

            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md mb-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Update Profile</h2>
                <input
                    type="text"
                    placeholder="New Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    onClick={updateProfile}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </div>

            <div className="max-w-xl mx-auto mb-6">
                <button
                    onClick={logout}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            {isAdmin && (
                <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-green-600 mb-4">Admin Panel</h2>
                    <input
                        type="email"
                        placeholder="User email to promote"
                        value={emailToPromote}
                        onChange={(e) => setEmailToPromote(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <button
                        onClick={promoteUser}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Promote to Admin
                    </button>
                </div>
            )}

            {isAdmin && orders.length > 0 && (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">All Orders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-lg font-bold text-blue-600 mb-2">
                                    Order #{order._id.slice(-6)}
                                </h3>
                                <p className="text-gray-600 mb-1">User: {order.user.name} ({order.user.email})</p>
                                <p className="text-gray-600 mb-1">Location: {order.location}</p>
                                <p className="text-gray-600 mb-1">Total: ${order.totalAmount}</p>
                                <ul className="list-disc pl-5 text-sm text-gray-700">
                                    {order.products.map(({ product, quantity }) => (
                                        <li key={product._id}>
                                            {product.name} × {quantity} @ ${product.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
