const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rehabitat',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
  }
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'rehabitat',
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileWithExt = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
  return publicId;
};

module.exports = { cloudinary, storage, uploadToCloudinary, deleteFromCloudinary, extractPublicId };
