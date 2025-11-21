import React, { useState } from 'react';
import { registerUser } from '../Api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import TopRightLogout from '../components/TopRightLogout'; // ✅ Add global session control

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const res = await registerUser(form);
            localStorage.setItem('token', res.data.token);
            toast.success(`Welcome, ${res.data.name}`);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 px-4 relative">
            <TopRightLogout /> {/* ✅ Top-right logout button */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Create Your ShopEase Account</h2>

                <div className="flex items-center border rounded mb-3 px-3">
                    <FaUser className="text-purple-500 mr-2" />
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 outline-none"
                    />
                </div>

                <div className="flex items-center border rounded mb-3 px-3">
                    <FaEnvelope className="text-purple-500 mr-2" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 outline-none"
                    />
                </div>

                <div className="flex items-center border rounded mb-3 px-3">
                    <FaLock className="text-purple-500 mr-2" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 outline-none"
                    />
                </div>

                <div className="flex items-center border rounded mb-4 px-3">
                    <FaMapMarkerAlt className="text-purple-500 mr-2" />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location (optional)"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full p-2 outline-none"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Register;
