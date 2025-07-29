import { Router } from 'express';
import { getAllCashRecords, getCashCurrency} from '../controllers/cashController.js';
import { getTickerNames } from '../controllers/stockController.js';

const router = Router();

// 现金记录路由
router.get('/cash', getAllCashRecords);
router.get('/cash/currency', getCashCurrency);

// 股票路由
router.get('/stock/name', getTickerNames);

export default router;