import express from 'express';
import jobController from '../controllers/jobController'

const router = express.Router();

router.post('/createJob', jobController.createJob);
router.post('/:jobId/apply', jobController.applyForJob);
router.get('/:jobId/applications', jobController.getJobApplications);



export default router;