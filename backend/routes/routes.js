import { Router } from 'express';
import { getAllCashRecords } from '../controllers/cashController.js';

const router = Router();

// 现金记录路由
router.get('/cash', getAllCashRecords);

export default router;