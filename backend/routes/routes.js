const Router = require('express');
const { getAllCashRecords, getBalanceSnapshot,updateBalanceSnapshot,insertCashRecords,deleteCashRecords } = require('../controllers/cashController.js');
const { getTickerNames } = require('../controllers/stockController.js');
const { chatBot } = require('../controllers/aiController.js');

const router = Router();

// Cash routes
router.get('/cash', getAllCashRecords);
router.get('/cash/currency', getBalanceSnapshot);

router.post('/cash/balance/snapshot', updateBalanceSnapshot);//测试用，前端不拿
router.post('/cash/insert',insertCashRecords)
router.delete('/cash/delete',deleteCashRecords)

// ticker routes
router.get('/stock/name', getTickerNames);


router.post('/chat', chatBot);

// export default router;
module.exports = router;