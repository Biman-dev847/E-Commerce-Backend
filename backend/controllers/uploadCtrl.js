import fs from 'fs'; // The fs module enables interacting with the file system in a way modeled
import { cloudinaryUploadImg, cloudinaryDeleteImg } from './../utils/cloudinary.js';
import asyncHandler from "express-async-handler";

export const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        // console.log(files);
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            //console.log(file);
            fs.unlinkSync(path); // unlinkSync() method is used to synchronously remove a file or symbolic link from the filesystem.
        };
        const images = urls.map((file) => {
            return file
        }); 
        res.json(images);
    } catch (error) {
        throw new Error(error);
    };
});

export const deleteImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({message: "Deleted"});
    } catch (error) {
        throw new Error(error);
    };
});