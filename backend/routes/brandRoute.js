import express from 'express';
import {
    createBrand,
    deleteBrand,
    updateBrand,
    getBrand,
    getAllBrands
} from '../controllers/brandCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const brandRouter = express.Router();

brandRouter.post('/', authMiddleware, isAdmin, createBrand);
brandRouter.put('/:id', authMiddleware, isAdmin, updateBrand);
brandRouter.delete('/:id', authMiddleware, isAdmin, deleteBrand);
brandRouter.get('/:id', getBrand);
brandRouter.get('/', getAllBrands);

export default brandRouter;