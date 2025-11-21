import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getMyOrders, createOrder, updateOrderStatus, deleteOrder } from '../Api';
import TopRightLogout from '../components/TopRightLogout';
import { useNavigate } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [location, setLocation] = useState('');
    const { cart, clearCart } = useCart();
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const navigate = useNavigate();

    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('userInfo'));
        } catch {
            return null;
        }
    })();
    const isAdmin = !!storedUser?.isAdmin;

    const itemCount = cart.length;
    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const deliveryFee = Number((subtotal * 0.1).toFixed(2));
    const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

    const STATUS_MAP = {
        Pending: 'placed',
        Processing: 'dispatched',
        Shipped: 'intransit',
        Delivered: 'delivered & ready for pickup',
        Completed: 'completed',
        Cancelled: 'completed'
    };
    const INV_STATUS_MAP = Object.entries(STATUS_MAP).reduce((acc, [ui, api]) => {
        acc[api] = ui;
        return acc;
    }, {});

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await getMyOrders(token);
            setOrders(res.data);
        } catch {
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const placeOrder = async () => {
        if (!location || cart.length === 0) {
            toast.error('Location and cart required');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await createOrder({ products: cart, location, deliveryFee }, token);
            toast.success('Order placed successfully');
            clearCart();
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed');
        }
    };

    const changeStatus = async (orderId, uiStatus) => {
        const newStatus = STATUS_MAP[uiStatus];
        if (!newStatus) {
            toast.error('Invalid status');
            return;
        }
        try {
            setUpdatingOrder(orderId);
            const token = localStorage.getItem('token');
            await updateOrderStatus({ orderId, status: newStatus }, token);
            toast.success(`Order status updated to ${uiStatus}`);
            await fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Status update failed');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const removeOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await deleteOrder(orderId, token);
            toast.success('Order deleted');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    // New cancel order handler for normal (non-admin) users
    const cancelOrder = async (orderId, token) => {
        try {
            await updateOrderStatus({ orderId, status: 'Cancelled' }, token);
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 relative">
            <div className="fixed top-4 right-4 flex gap-4 z-50">
                <button
                    className="relative bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    title="Cart"
                >
                    <FaShoppingCart size={20} />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                            {itemCount}
                        </span>
                    )}
                </button>
                <TopRightLogout />
            </div>

            <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Your Orders</h1>

            {isAdmin && (
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Back to Products
                    </button>
                </div>
            )}

            {/* Place new order card */}
            <div className="bg-white p-4 rounded shadow-md mb-6 max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-green-600 mb-4">Place New Order</h2>
                <div className="mb-3">
                    <label className="flex items-center gap-2 text-gray-700 mb-1">
                        <FaMapMarkerAlt /> Delivery Location
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter delivery location"
                    />
                </div>
                <div className="mb-3 text-gray-700 space-y-1">
                    <p>Subtotal: Ksh{subtotal.toFixed(2)}</p>
                    <p>Delivery Fee (10%): Ksh{deliveryFee.toFixed(2)}</p>
                    <p className="font-bold text-green-700">Total Amount: Ksh{totalAmount.toFixed(2)}</p>
                </div>
                <button
                    onClick={placeOrder}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Confirm Order
                </button>
            </div>

            {/* Orders grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded shadow-md p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-blue-600">Order #{order._id.slice(-6)}</h3>
                            <span className="text-sm text-gray-500 font-semibold">
                                {INV_STATUS_MAP[order.status] || order.status || 'Pending'}
                            </span>
                        </div>
                        <div className="space-y-1 text-gray-600 mb-3">
                            <p>Location: {order.location}</p>
                            <p>Delivery Fee: Ksh{order.deliveryFee}</p>
                            <p>Total: Ksh{order.totalAmount}</p>
                        </div>

                        <div className="space-y-2 mb-3">
                            {order.products.map(({ product, quantity }, idx) => (
                                <div key={product?._id || idx} className="flex items-center gap-3">
                                    {product ? (
                                        <>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500">
                                                    No image
                                                </div>
                                            )}
                                            <span className="text-sm">
                                                {product.name} × {quantity} @ Ksh{product.price}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-red-500 text-sm">[Product missing]</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {isAdmin && (
                                <>
                                    <select
                                        value={INV_STATUS_MAP[order.status] || 'Pending'}
                                        onChange={(e) => changeStatus(order._id, e.target.value)}
                                        className="border rounded p-2 text-sm"
                                        disabled={updatingOrder === order._id}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => fetchOrders()}
                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                                    >
                                        Refresh
                                    </button>
                                    <button
                                        onClick={() => removeOrder(order._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}

                            {/* Only show Cancel button for non-admin, and if not cancelled */}
                            {!isAdmin && order.status !== 'cancelled' && (
                                <button
                                    onClick={() =>
                                        cancelOrder(order._id, localStorage.getItem('token'))
                                            .then(() => { toast.success('Order cancelled'); fetchOrders(); })
                                            .catch(err => toast.error(err.response?.data?.message || 'Cancel failed'))
                                    }
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;
