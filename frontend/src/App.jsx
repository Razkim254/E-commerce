import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Product from './pages/Product';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import AdminCategory from './pages/AdminCategory';
import AdminProduct from './pages/AdminProduct';
import ProductDetail from './pages/ProductDetail';
import TopRightLogout from './components/TopRightLogout';
import { CartProvider } from './context/CartContext'; // ✅ wrap app with CartProvider
import './index.css';

function App() {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUserChanged = () => {
      try {
        const stored = localStorage.getItem('userInfo');
        setUserInfo(stored ? JSON.parse(stored) : null);
      } catch {
        setUserInfo(null);
      }
    };

    window.addEventListener('userChanged', handleUserChanged);

    const handleStorage = (e) => {
      if (e.key === 'userInfo') handleUserChanged();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <TopRightLogout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Product />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin-only routes */}
          <Route
            path="/admin/categories"
            element={userInfo?.isAdmin ? <AdminCategory /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin/products"
            element={userInfo?.isAdmin ? <AdminProduct /> : <Navigate to="/login" replace />}
          />

          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
