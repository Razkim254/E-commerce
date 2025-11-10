import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Register user (no role assignment allowed)
export const registerUser = async (req, res) => {
    const { name, email, password, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, location });
    const createdUser = await User.findById(user._id).select('+isAdmin');

    res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        location: createdUser.location,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser._id)
    });
};

// 🔑 Login user and return role
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +isAdmin');
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
    });
};

// 🧑‍💼 Admin-only promotion route
export const promoteToAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email }).select('+isAdmin');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isAdmin) {
        return res.status(400).json({ message: 'User is already an admin.' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ message: `${user.name} has been promoted to admin.` });
};
