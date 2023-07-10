import express from "express";
import { uploadImages, deleteImages } from "../controllers/uploadCtrl.js";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadimages.js";

export const uploadRouter = express.Router();

uploadRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array(
    "images",
    10
  ) /**Here we use .array because we will upload multiple images  */,
  productImgResize,
  uploadImages
);

uploadRouter.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
