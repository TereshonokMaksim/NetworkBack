import { Router } from 'express';
import * as albumController from './album.controller';
import { authenticateMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateMiddleware, albumController.create);
router.get('/', authenticateMiddleware, albumController.getAll);

export default router;