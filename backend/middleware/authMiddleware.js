import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔐 Protect routes for logged-in users
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password +isAdmin');
            if (!req.user) return res.status(401).json({ message: 'User not found' });

            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'No token, authorization denied' });
    }
};

// 🛡️ Restrict access to admins only
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access denied' });
    }
};
