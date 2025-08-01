<<<<<<< HEAD
const Router = require('express');
const { updateCashRecords, getAllCashRecords, getAllCashTimeSeries, getBalanceSnapshot, updateBalanceSnapshot, insertCashRecords, deleteCashRecords } = require('../controllers/cashController.js');
const { getTickerNames, getTickerRecords, getAllStockTimeSeries, getStockTimeSeriesById, insertStockRecords, deleteStockRecordsById,updateStockRecords } = require('../controllers/stockController.js');
const { getSummaryData, getSearchData, getTimeSeriesDataInCNY } = require('../controllers/summaryController.js');
const { chatBot } = require('../controllers/aiController.js');
const { deleteTickersByCode, updateTickersByCode } = require('../controllers/stockDataController.js')
const { getAllDepositRecord, insertDepositRecord,deleteDepositRecordById,updateDepositRecordById, } = require('../controllers/depositController.js');
const { getAllFundRecord,deleteFundRecordById, updateFundRecordById, insertFundRecord } = require('../controllers/fundController.js');
const { getAllOtherRecords,addOtherRecord,updateOtherRecord,deleteOtherRecord } = require('../controllers/othersController.js')
const { getAllBondRecords, updateBondRecord,addBondRecord,deleteBondRecord } = require('../controllers/bondController.js')

=======
import { Router } from 'express';
import { getAllCashRecords } from '../controllers/cashController.js';
>>>>>>> origin/frontend

const router = Router();

// 现金记录路由
router.get('/cash', getAllCashRecords);

<<<<<<< HEAD
router.post('/cash/balance/snapshot', updateBalanceSnapshot);//测试用，前端不拿
router.post('/cash/insert', insertCashRecords);
router.delete('/cash/delete', deleteCashRecords);
router.get('/cash/timeline', getAllCashTimeSeries);
router.post('/cash/update', updateCashRecords);


// Stock routes
router.get('/stock/currency', getTickerNames);
router.get('/stock', getTickerRecords);
router.get('/stock/timeline', getAllStockTimeSeries);
router.get('/stock/timeline/:id', getStockTimeSeriesById);
router.post('/stock/insert', insertStockRecords);
router.delete('/stock/delete', deleteStockRecordsById)
router.post('/stock/update', updateStockRecords);

// Deposit routes
router.get('/deposit', getAllDepositRecord);
router.post('/deposit/insert', insertDepositRecord);
router.delete('/deposit/delete', deleteDepositRecordById);
router.post('/deposit/update', updateDepositRecordById);


// funds routes
router.get('/funds', getAllFundRecord);
router.post('/funds/insert', insertFundRecord);
router.delete('/funds/delete', deleteFundRecordById);
router.post('/funds/update', updateFundRecordById);

// others routes
router.get('/others', getAllOtherRecords);
router.post('/others/insert', addOtherRecord);
router.delete('/others/delete', deleteOtherRecord);
router.post('/others/update', updateOtherRecord);

// bonds routes
router.get('/bonds', getAllBondRecords);
router.post('/bonds/insert', addBondRecord);
router.delete('/bonds/delete', deleteBondRecord);
router.post('/bonds/update', updateBondRecord);

//总面板和搜索栏
router.get('/summary', getSummaryData);
router.get('/search', getSearchData);
router.get('/timeline', getTimeSeriesDataInCNY)

router.post('/chat', chatBot);

// export default router;
module.exports = router;
=======
export default router;
>>>>>>> origin/frontend
