const Router = require('express');
const { getAllCashRecords, getCashCurrency } = require('../controllers/cashController.js');
const { getTickerNames } = require('../controllers/stockController.js');
const { chatBot } = require('../controllers/aiController.js');

const router = Router();

// 现金记录路由
router.get('/cash', getAllCashRecords);
router.get('/cash/currency', getCashCurrency);

// 股票路由
router.get('/stock/name', getTickerNames);


router.post('/chat', chatBot);

// export default router;
module.exports = router;