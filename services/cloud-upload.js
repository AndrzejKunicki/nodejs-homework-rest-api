const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
  secure: true,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadService {
  async saveAvatar(pathFile, oldIdCloudAvatar) {
    const { public_id: idCloudAvatar, secure_url: avatarUrl } =
      await uploadCloud(pathFile, {
        public_id: oldIdCloudAvatar?.replace("CloudAvatar/", ""),
        folder: "CloudAvatar",
        transformation: { width: 250, height: 250, crop: "pad" },
      });
    return { idCloudAvatar, avatarUr };
  }
}

module.exports = UploadService;
