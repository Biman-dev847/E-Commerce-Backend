import express from 'express';
import {
    createColor,
    deleteColor,
    updateColor,
    getColor,
    getAllColors
} from '../controllers/colorCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const colorRouter = express.Router();

colorRouter.post('/', authMiddleware, isAdmin, createColor);
colorRouter.put('/:id', authMiddleware, isAdmin, updateColor);
colorRouter.delete('/:id', authMiddleware, isAdmin, deleteColor);
colorRouter.get('/:id', getColor);
colorRouter.get('/', getAllColors);

export default colorRouter;