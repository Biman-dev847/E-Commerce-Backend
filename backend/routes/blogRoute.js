import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeTheBlog,
    dislikeTheBlog,
    uploadImages
} from '../controllers/blogCtrl.js';
import { blogImgResize, uploadPhoto } from '../middlewares/uploadimages.js';


const blogRouter = express.Router();

blogRouter.post('/', authMiddleware, isAdmin, createBlog);
blogRouter.put('/upload/:id',
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2), /**Here we use .array because we will upload multiple images  */
    blogImgResize,
    uploadImages
);
blogRouter.put('/likes', authMiddleware, likeTheBlog);
blogRouter.put('/dislikes', authMiddleware, dislikeTheBlog);
blogRouter.put('/:id', authMiddleware, isAdmin, updateBlog);
blogRouter.get('/:id', getBlog); /** To view a blog we don't need to be an admin, a blog post is public */
blogRouter.get('/', getAllBlogs);
blogRouter.delete('/:id', authMiddleware, isAdmin, deleteBlog); /**Only an admin can delete a blog post */


export default blogRouter;