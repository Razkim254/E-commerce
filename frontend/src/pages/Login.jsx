import { useState } from 'react';
import { loginUser } from '../Api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import TopRightLogout from '../components/TopRightLogout';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            const { token, name, isAdmin } = res.data;

            // Save full user info and token
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            localStorage.setItem('token', token);

            // Notify the rest of the app that user changed (no full reload)
            window.dispatchEvent(new Event('userChanged'));

            toast.success(`Welcome back, ${name}`);

            // Redirect based on role
            if (isAdmin) {
                navigate('/admin/products');
            } else {
                navigate('/shop');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4 relative">
            <TopRightLogout />
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Welcome Back</h2>

                <div className="flex items-center border rounded mb-4 px-3">
                    <FaEnvelope className="text-blue-500 mr-2" />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex items-center border rounded mb-6 px-3 relative">
                    <FaLock className="text-blue-500 mr-2" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full p-2 outline-none pr-8"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-blue-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
