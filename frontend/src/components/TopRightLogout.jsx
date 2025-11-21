import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function TopRightLogout() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="fixed top-4 right-2 flex gap-3 z-50">
            {!token ? (
                <>
                    {location.pathname !== '/login' && (
                        <Link
                            to="/login"
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                            Login
                        </Link>
                    )}
                    {location.pathname !== '/register' && (
                        <Link
                            to="/register"
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                        >
                            Register
                        </Link>
                    )}
                </>
            ) : (
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            )}
        </div>
    );
}

export default TopRightLogout;
