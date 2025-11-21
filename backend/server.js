import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/db.js';

import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Configure CORS

dotenv.config();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => res.send('API is running...'));

// ✅ Mount routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port 🚀🚀 ${PORT}`);
});
