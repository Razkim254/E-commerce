import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        size: { type: String },
        model: { type: String },
        version: { type: String },
        other: { type: String }
    },
    images: [
        {
            url: { type: String, required: true },       // ✅ Cloudinary URL
            public_id: { type: String, required: true }  // ✅ Cloudinary public_id
        }
    ]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
