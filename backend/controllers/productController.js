import Product from '../models/Product.js';
import Category from '../models/Category.js';

// 🔁 Helper: resolve category name to ObjectId
const resolveCategoryId = async (categoryName) => {
    const category = await Category.findOne({ name: categoryName });
    if (!category) throw new Error(`Category '${categoryName}' not found`);
    return category._id;
};

// ✅ Create one or many products (admin only)
export const createProduct = async (req, res) => {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const productsToCreate = [];

        for (let i = 0; i < payload.length; i++) {
            const item = payload[i];
            if (!item || typeof item !== 'object') {
                return res.status(400).json({ message: `Invalid product at index ${i}` });
            }

            const { name, categoryName, price, description } = item;

            if (!name || !categoryName || !price) {
                return res.status(400).json({ message: `Missing fields in product at index ${i}` });
            }

            const categoryId = await resolveCategoryId(categoryName);

            productsToCreate.push({
                name,
                category: categoryId,
                price,
                description
            });
        }

        const created = await Product.insertMany(productsToCreate);
        res.status(201).json(created.length === 1 ? created[0] : created);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🌐 Get all products (public)
export const getProducts = async (req, res) => {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
};

// 🔍 Get single product by name (public)
export const getProductByName = async (req, res) => {
    const product = await Product.findOne({ name: req.params.name }).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

// ✏️ Update one or many products by name (admin only)
export const updateProductByName = async (req, res) => {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const updates = [];

        for (let i = 0; i < payload.length; i++) {
            const { targetName, name, categoryName, price, description } = payload[i];
            const product = await Product.findOne({ name: targetName });
            if (!product) throw new Error(`Product '${targetName}' not found`);

            if (categoryName) {
                const categoryId = await resolveCategoryId(categoryName);
                product.category = categoryId;
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;

            await product.save();
            updates.push(product);
        }

        res.json(updates.length === 1 ? updates[0] : updates);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🗑️ Delete one or many products by name (admin only)
export const deleteProductByName = async (req, res) => {
    const names = Array.isArray(req.body) ? req.body : [req.params.name];

    try {
        const deletions = [];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const product = await Product.findOne({ name });
            if (!product) throw new Error(`Product '${name}' not found`);
            await product.deleteOne();
            deletions.push(name);
        }

        res.json({ message: `Deleted products: ${deletions.join(', ')}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
