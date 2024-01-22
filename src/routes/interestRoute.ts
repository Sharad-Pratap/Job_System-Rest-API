import express from 'express';
import { createInterest } from '../controllers/interestController';
const router = express.Router();

router.post('/createInterest', createInterest);


export default router;