const cloudinary = require('cloudinary').v2;

// Configure cloudinary only if env vars are set
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
} catch (e) {
  console.log('Cloudinary not configured, using local uploads');
}

// Dummy storage that just stores files locally (multer memory storage)
const storage = null;

const uploadToCloudinary = async (filePath) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'faunarescue',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
      });
      return result.secure_url;
    }
    return filePath; // Fallback to local path
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return filePath;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
      await cloudinary.uploader.destroy(publicId);
    }
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
