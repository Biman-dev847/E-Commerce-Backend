import Category from '../models/blogCatModel.js';
import asyncHandler from 'express-async-handler';
import { validateMongoDbId } from '../utils/validateMongodbid.js';

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id,
            req.body,
            { new: true });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

export const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getCategories = await Category.find();
        res.json(getCategories);
    } catch (error) {
        throw new Error(error);
    }
});