import express from 'express';
import {
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
    getAllCategories
} from '../controllers/blogCatCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const blogcategoryRouter = express.Router();

blogcategoryRouter.post('/', authMiddleware, isAdmin, createCategory);
blogcategoryRouter.put('/:id', authMiddleware, isAdmin, updateCategory);
blogcategoryRouter.delete('/:id', authMiddleware, isAdmin, deleteCategory);
blogcategoryRouter.get('/:id', getCategory);
blogcategoryRouter.get('/', getAllCategories);

export default blogcategoryRouter;