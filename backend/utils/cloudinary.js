import cloudinary from "cloudinary"; /**Cloudinary is a cloud service built  that makes image and video 
storage and management easy and convenient. It is helpful To upload image to server */
import dotenv from "dotenv";
dotenv.config();

/**To use cloudinary you will need to create a free account and get credentials. After login you can find required keys on 
dashboard under “Account Details” section and then paste it in index.js or save in .env file*/

// Config the cloudinary to upload images
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Now we need to write a function which will accept local image file’s path and will upload it to Cloudinary.
export const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpload, (result) => {
      resolve(
        {
          url: result.secure_url, // Get image url as response if upload is successful.
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  }); // Creates a new Promise.
};

export const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url, // Get image url as response if upload is successful.
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  }); // Creates a new Promise.
};
