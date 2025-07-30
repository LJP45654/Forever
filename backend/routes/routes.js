const Router = require('express');
const { getAllCashRecords, getBalanceSnapshot,updateBalanceSnapshot,insertCashRecords,deleteCashRecords } = require('../controllers/cashController.js');
const { getTickerNames,getTickerRecords } = require('../controllers/stockController.js');
const { getSummaryData,getSearchData,getTimeSeriesDataInCNY } = require('../controllers/summaryController.js');
const { chatBot } = require('../controllers/aiController.js');

const router = Router();

// Cash routes
router.get('/cash', getAllCashRecords);
router.get('/cash/currency', getBalanceSnapshot);

router.post('/cash/balance/snapshot', updateBalanceSnapshot);//测试用，前端不拿
router.post('/cash/insert',insertCashRecords)
router.delete('/cash/delete',deleteCashRecords)

// Stock routes
router.get('/stock/name', getTickerNames);
router.get('/stock', getTickerRecords);

//总面板和搜索栏
router.get('/summary',getSummaryData);
router.get('/search',getSearchData);
router.get('/timeline',getTimeSeriesDataInCNY)

router.post('/chat', chatBot);

// export default router;
module.exports = router;