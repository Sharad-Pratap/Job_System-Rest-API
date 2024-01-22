import express from 'express';
import { createCategory } from '../controllers/categoryController';

const router = express.Router();

router.post('/create-category', createCategory);


export default router;