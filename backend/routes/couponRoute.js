import express from 'express';
import {
    createCoupon,
    deleteCoupon,
    getAllCoupons,
    updateCoupon,
    getCoupon
} from '../controllers/couponCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const couponRouter = express.Router();

couponRouter.post('/', authMiddleware, isAdmin, createCoupon);
couponRouter.get('/', authMiddleware, isAdmin, getAllCoupons);
couponRouter.get('/:id', authMiddleware, isAdmin, getCoupon);
couponRouter.put('/:id', authMiddleware, isAdmin, updateCoupon);
couponRouter.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

export default couponRouter;