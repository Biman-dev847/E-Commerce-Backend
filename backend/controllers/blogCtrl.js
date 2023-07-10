import Blog from './../models/blogModel.js';
import User from './../models/userModel.js';
import { validateMongoDbId } from './../utils/validateMongodbid.js';
import asyncHandler from 'express-async-handler';

import fs from 'fs';


export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body); //create a new instance of the model and pass in the data from the request.body. 
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // validate the id.
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

export const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // validate that the id is a mongodb id.
    try {
        const getBlog = await Blog.findById(id)
            .populate('likes')
            .populate('dislikes');/** Normally when we get a blog it is like to view the blog then  the number of views must be incremented so 
        we do this with the statement below */
        /**populate() Specifies paths which should be populated with other documents. */;

        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 }, /**$inc is used to increment the number of views of the blog in database
                so get a blog means view the blog */
            },
            { new: true }
        );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); //validate the id before deletion.
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

export const likeTheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log(blogId);
    validateMongoDbId(blogId);
    ; // validate that the id is a mongodb id.

    const blog = await Blog.findById(blogId);//find the blog which you want to be liked and get it.
    const loginUserId = req?.user?.id; /**Get the login user's _id with the help of
 the authMiddleware because only a login user can like or disLike a blog */

    // Check if the user has liked the blog.
    const isLiked = blog?.isLiked;

    // Check if the user has disliked the blog.
    const alreadyDisliked = blog?.dislikes?.find((
        (userId) => userId?.toString() === loginUserId?.toString()
    )); // The find method returns the value of the first element in the array where predicate is true, and undefined otherwise.

    if (alreadyDisliked) {
        // If the user has already dislike the blog then we need to remove the user from the dislikes array.
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId }, /**The $pull operator removes from an existing 
            array all instances of a value or values that match a specified condition. */
                isDisliked: false
            },
            { new: true }
        );
        res.json(blog);
    };

    if (isLiked) {
        // If the user has already liked the blog remove the user from the likes array;
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        // If the user has not liked the post then add the user to the likes array.
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId }, // The $push operator appends a specified value to an array.
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    };
});

export const dislikeTheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log(blogId);
    validateMongoDbId(blogId);
    ; // validate that the id is a mongodb id.

    const blog = await Blog.findById(blogId);//find the blog which you want to be liked and get it.
    const loginUserId = req?.user?.id; /**Get the login user's _id with the help of
 the authMiddleware because only a login user can like or disLike a blog */

    // Check if the user has disliked the blog.
    const isDisliked = blog?.isDisliked;

    // Check if the user has liked the blog.
    const alreadyLiked = blog?.likes?.find((
        (userId) => userId?.toString() === loginUserId?.toString()
    )); // The find method returns the value of the first element in the array where predicate is true, and undefined otherwise.

    if (alreadyLiked) {
        // If the user has already liked the blog then we need to remove the user from the likes array, to make the blog disliked
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId }, /**The $pull operator removes from an existing 
            array all instances of a value or values that match a specified condition. */
                isLiked: false
            },
            { new: true }
        );
        res.json(blog);
    };

    if (isDisliked) {
        // If the user has already disliked the blog remove the user from the dislikes array;
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        // If the user has not liked the post then add the user to the likes array.
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId }, // The $push operator appends a specified value to an array.
                isDisliked: true,
            },
            { new: true }
        );
        res.json(blog);
    };
});

export const uploadImages = asyncHandler(async (req, res) => {
    //console.log(req.files);
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploading(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        };
        const findBlog = await Blog.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file
                })
            },
            {
                new: true
            }
        );
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    };
});


