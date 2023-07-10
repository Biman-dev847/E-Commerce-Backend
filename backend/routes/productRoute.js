import express from 'express';
import {
    addToWishlist,
    createProduct,
    deleteProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    rating,
} from '../controllers/productCtrl.js';
import { isAdmin, authMiddleware } from '../middlewares/authMiddleware.js';

export const productRouter = express.Router();

productRouter.post('/', authMiddleware, isAdmin, createProduct); //Only an admin can create products

productRouter.get('/:id', getAProduct);
productRouter.put('/wishlist', authMiddleware, addToWishlist);
productRouter.put('/rating', authMiddleware, rating);
productRouter.put('/:id', authMiddleware, isAdmin, updateProduct); //Only an admin can update products
productRouter.delete('/:id', authMiddleware, isAdmin, deleteProduct); //Only an admin can delete products
productRouter.get('/', getAllProducts);