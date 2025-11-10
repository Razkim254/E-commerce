import Category from '../models/Category.js';

// ✅ Create category (admin only)
export const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name });
    res.status(201).json(category);
};

// 🌐 Get all categories (public)
export const getCategories = async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
};

// 🔍 Get single category by name (public)
export const getCategoryByName = async (req, res) => {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
};

// ✏️ Update category by name (admin only)
export const updateCategoryByName = async (req, res) => {
    const { name: newName } = req.body;
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = newName || category.name;
    await category.save();
    res.json(category);
};

// 🗑️ Delete category by name (admin only)
export const deleteCategoryByName = async (req, res) => {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
};
