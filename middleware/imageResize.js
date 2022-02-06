require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(locaFilePath, type = "normal") {
  let params = {};
  params = { width: 2000, height: 2000, crop: "limit" };

  if (type === "thumb") {
    params = { width: 100, height: 100, crop: "thumb" };
  }

  return cloudinary.uploader
    .upload(locaFilePath, params)
    .then((result) => {
      return result.url;
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

module.exports = async (req, res, next) => {
  const images = [];

  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
  }

  const resizePromises = req.files.map(async (file) => {
    const imageUrl = await uploadToCloudinary(file.path);
    const thumbnailUrl = await uploadToCloudinary(file.path, "thumb");
    fs.unlinkSync(file.path);

    images.push({
      originalUrl: imageUrl,
      thumbnailUrl: thumbnailUrl,
    });
  });

  await Promise.all([...resizePromises]);
  req.images = images;

  next();
};
