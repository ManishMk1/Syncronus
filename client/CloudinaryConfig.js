import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  // your cloudinary config here
  cloud_name: CLOUDINARY_API_KEY,
  api_key: '928616584221493',
  api_secret: 'tBB_dlWgd-U01AgT8yExj72N_1k'
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "syncronous",
      allowedFormats: ['png', 'jpg', 'jpeg'],
      public_id: file.originalname.split(".")[0] + Date.now(),
    }
  },
  // filename: {
  // }
});

export { cloudinary };
