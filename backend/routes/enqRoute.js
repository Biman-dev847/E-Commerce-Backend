import express from 'express';
import {
    createEnquiry,
    deleteEnquiry,
    updateEnquiry,
    getEnquiry,
    getAllEnquiries
} from '../controllers/enqCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const enqRouter = express.Router();

enqRouter.post('/', createEnquiry);
enqRouter.put('/:id', authMiddleware, isAdmin, updateEnquiry);
enqRouter.delete('/:id', authMiddleware, isAdmin, deleteEnquiry);
enqRouter.get('/:id', getEnquiry);
enqRouter.get('/', getAllEnquiries);

export default enqRouter;