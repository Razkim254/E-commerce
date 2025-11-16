import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../Config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',           // organize assets in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'],
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }], // smart delivery
    },
});

const upload = multer({ storage });

export default upload;
