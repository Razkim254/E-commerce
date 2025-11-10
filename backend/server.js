import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'; // ✅ Import product routes
import orderRoutes from './routes/orderRoutes.js'; // ✅ Import order routes


dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('API is running...'));

// User auth and admin routes
app.use('/api/users', userRoutes);

// ✅ Mount category routes
app.use('/api/categories', categoryRoutes);

// ✅ Mount product routes
app.use('/api/products', productRoutes);

// ✅ Mount order routes
app.use('/api/orders', orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port 🚀🚀 ${PORT}`);
});
