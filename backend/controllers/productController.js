import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { v2 as cloudinary } from 'cloudinary';

// 🔁 Helper: resolve category name to ObjectId
const resolveCategoryId = async (categoryName) => {
    const category = await Category.findOne({ name: categoryName });
    if (!category) throw new Error(`Category '${categoryName}' not found`);
    return category._id;
};

// 🧩 Helper: normalize description from body (object or JSON string)
const normalizeDescription = (desc) => {
    if (!desc) return {};
    if (typeof desc === 'string') {
        try { return JSON.parse(desc); } catch { return { other: desc }; }
    }
    return desc;
};

// ✅ Create one or many products (admin only) with Cloudinary images
export const createProduct = async (req, res) => {
    try {
        console.log("Raw req.body:", req.body);
        console.log("Raw req.files:", req.files);

        const { name, categoryName, price, description } = req.body;

        if (!name || !categoryName || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const categoryId = await resolveCategoryId(categoryName);

        const uploadedImages = (req.files || []).map(f => ({
            url: f.path,
            public_id: f.filename || f.public_id || f.originalname || 'unknown',
        }));

        const product = new Product({
            name,
            category: categoryId,
            price,
            description: normalizeDescription(description),
            images: uploadedImages,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: error.message });
    }
};


// 🌐 Get all products (public)
export const getProducts = async (req, res) => {
    const products = await Product.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    res.json(products);
};

// 🔍 Get single product by name (public)
export const getProductByName = async (req, res) => {
    const product = await Product.findOne({ name: req.params.name })
        .populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

// ✏️ Update one or many products by name (admin only)
export const updateProductByName = async (req, res) => {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const updates = [];
        const uploadedImages = (req.files || []).map(f => ({
            url: f.path,
            public_id: f.filename,
        }));

        for (let i = 0; i < payload.length; i++) {
            const { targetName, name, categoryName, price } = payload[i];
            const description = normalizeDescription(payload[i].description);

            const product = await Product.findOne({ name: targetName });
            if (!product) throw new Error(`Product '${targetName}' not found`);

            if (categoryName) {
                const categoryId = await resolveCategoryId(categoryName);
                product.category = categoryId;
            }

            product.name = name ?? product.name;
            product.price = price ?? product.price;
            product.description = Object.keys(description).length ? description : product.description;

            // ✅ Handle images: replace or append
            if (uploadedImages.length > 0) {
                // Replace existing images
                product.images = uploadedImages;

                // Or append new images (if you want to keep old ones too):
                // product.images = [...product.images, ...uploadedImages];
            }

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

            // ✅ Clean up Cloudinary images if public_id is stored
            if (product.images && product.images.length > 0) {
                for (const img of product.images) {
                    if (img.public_id) {
                        await cloudinary.uploader.destroy(img.public_id);
                    }
                }
            }

            await product.deleteOne();
            deletions.push(name);
        }

        res.json({ message: `Deleted products: ${deletions.join(', ')}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// 🔍 Get single product by ID (public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
