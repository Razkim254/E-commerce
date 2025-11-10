import Order from '../models/Order.js';
import Product from '../models/Product.js';

// 🛒 Place an order (user-friendly: resolves product names)
export const placeOrder = async (req, res) => {
    const { products, location, deliveryFee } = req.body;
    const userId = req.user._id;

    try {
        const productDocs = await Promise.all(
            products.map(async ({ name, quantity }) => {
                const prod = await Product.findOne({ name });
                if (!prod) throw new Error(`Product '${name}' not found`);
                return { product: prod._id, quantity };
            })
        );

        const totalProductCost = await Promise.all(
            productDocs.map(async ({ product, quantity }) => {
                const prod = await Product.findById(product);
                return prod.price * quantity;
            })
        );

        const totalAmount = totalProductCost.reduce((sum, val) => sum + val, 0) + deliveryFee;

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
            .populate('products.product', 'name price')
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
            .populate('products.product', 'name price')
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
