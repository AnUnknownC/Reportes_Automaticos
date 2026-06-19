// routes/auth.routes.js
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/verifyJWT';
import { checkPlanLimit } from '../middlewares/checkLimitPlan';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login',    AuthController.login);
router.use('/clients', verifyJWT, checkPlanLimit('create_client'));

export default router;