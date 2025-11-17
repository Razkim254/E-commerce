import Order from '../models/Order.js';
import Product from '../models/Product.js';

// 🛒 Place an order (user-friendly: resolves product names)
export const placeOrder = async (req, res) => {
    const { products, location } = req.body; // ✅ no longer trust deliveryFee from frontend
    const userId = req.user._id;

    try {
        // Resolve product IDs from names
        const productDocs = await Promise.all(
            products.map(async ({ name, quantity }) => {
                const prod = await Product.findOne({ name });
                if (!prod) throw new Error(`Product '${name}' not found`);
                return { product: prod._id, quantity };
            })
        );

        // Compute subtotal from product prices × quantities
        const totalProductCost = await Promise.all(
            productDocs.map(async ({ product, quantity }) => {
                const prod = await Product.findById(product);
                return prod.price * quantity;
            })
        );

        const subtotal = totalProductCost.reduce((sum, val) => sum + val, 0);

        // ✅ Always recompute deliveryFee here (10% of subtotal)
        const deliveryFee = Number((subtotal * 0.1).toFixed(2));
        const totalAmount = subtotal + deliveryFee;

        // Create order
        const order = await Order.create({
            user: userId,
            products: productDocs,
            location,
            deliveryFee,
            totalAmount,
            paid: true
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 👤 Get my orders (user)
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate('products.product', 'name price images') // ✅ include images
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧑‍💼 Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price images') // ✅ include images
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔄 Update order status (admin)
export const updateOrderStatus = async (req, res) => {
    const { orderId, productName, status } = req.body;

    try {
        let order;

        if (orderId) {
            order = await Order.findById(orderId);
        } else if (productName) {
            const product = await Product.findOne({ name: productName });
            if (!product) throw new Error(`Product '${productName}' not found`);
            order = await Order.findOne({ 'products.product': product._id });
        }

        if (!order) throw new Error('Order not found');

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// ❌ Delete order (user or admin)
export const deleteOrder = async (req, res) => {
    const { orderId } = req.params; // we'll pass orderId in URL

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optional: check if user is owner or admin
        if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this order' });
        }

        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ❌ Cancel order (user)
export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow if current user owns the order
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Update status instead of deleting
        order.status = 'cancelled'; // add 'cancelled' to your enum in Order schema
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
