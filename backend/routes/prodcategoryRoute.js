import express from 'express';
import {
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
    getAllCategories
} from '../controllers/prodcategoryCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, isAdmin, createCategory);
categoryRouter.put('/:id', authMiddleware, isAdmin, updateCategory);
categoryRouter.delete('/:id', authMiddleware, isAdmin, deleteCategory);
categoryRouter.get('/:id', getCategory);
categoryRouter.get('/', getAllCategories);

export default categoryRouter;