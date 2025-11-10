import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        select: false // hides password from queries unless explicitly selected
    },

    isAdmin: {
        type: Boolean,
        default: false,
        select: false // prevents exposure unless explicitly requested
    },

    location: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// 🔐 Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);
