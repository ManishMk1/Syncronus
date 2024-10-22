import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  // your cloudinary config here
  cloud_name: 'dr4y9vbmd',
  api_key: 354972672349174,
  api_secret: "RuJYDerJS5KiinjhGYC14oRAE1I",
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
