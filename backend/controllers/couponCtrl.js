import Coupon from "../models/couponModel.js";
import { validateMongoDbId } from './../utils/validateMongodbid.js';
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

export const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});

export const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});
export const getCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getAcoupon = await Coupon.findById(id);
        res.json(getAcoupon);
    } catch (error) {
        throw new Error(error);
    }
});