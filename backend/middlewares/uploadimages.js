import multer from 'multer'; // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
import sharp from 'sharp'; /** It is a node js module used to modify images such as 
convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions,
Resizing an image, operations such as rotation, extraction, compositing and gamma correction are available.
 */
import path from 'path'; /**The node:path module provides utilities for working with file and directory paths. */
import { dirname } from 'path';// Return the directory name of a path.
import { fileURLToPath } from 'url';/**fileURLToPath function decodes the file URL to a path string and ensures that the URL control characters (/, %) are correctly
 appended/adjusted when converting the given file URL into a path. */
import fs from 'fs'; // // To get file paths, remove files

/**If you are using node js modules __dirname and __filename don't exist.
Equivalents of __filename and __dirname can be created inside of each file via import.meta.url */
const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file

const multerStorage = multer.diskStorage({
    // destination is a string or function that determines the destination path for uploaded files.
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images")); // Joins all arguments together and normalize the resulting path.)
    },

    // filename is a function that determines the name of the uploaded file.
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    }
}); // Returns a StorageEngine implementation configured to store files on the local file system.


// The file MIME (Multipurpose Internet Mail Extensions) type is a string identifier that specifies the format of a file. Web browsers and servers use it to determine 
//how to handle a file when requesting or uploading a file.
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb({
            message: "Unsupported file format"
        },
            false
        );
    }
};

export const uploadPhoto = multer({
    storage: multerStorage, //A StorageEngine responsible for processing files uploaded via Multer.
    fileFilter: multerFilter, // Optional function to control which files are uploaded. This is called for every file that is processed.
    limits: { fieldSize: 2000000, /**Maximum size of each form field value in bytes. (Default: 1048576)*/ }, // An object specifying various limits on incoming data
}); //Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.

/**Resize the products images */
export const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/products/${file.filename}`);
            fs.unlinkSync(`public/images/products/${file.filename}`); // Remove image from local computer’s folder as we have uploaded it to Cloudinary.
    }));// Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
    next();
};

/**Resize the blogs images */
export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`);
            fs.unlinkSync(`public/images/blogs/${file.filename}`);
    }));// Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
    next();
};