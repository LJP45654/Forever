const request = require('supertest');
const express = require('express');
const { getSummaryData, getSearchData, getTimeSeriesDataInCNY } = require('../controllers/summaryController');

jest.mock('../utils/db.js', () => ({
  query: jest.fn()
}));

jest.mock('../controllers/stockController.js', () => ({
  getStockTimeSeries: jest.fn().mockResolvedValue([])
}));

jest.mock('../controllers/cashController.js', () => ({
  getCashTimeSeries: jest.fn().mockResolvedValue([])
}));

jest.mock('../controllers/depositController.js', () => ({
  getDepositTimeSeries: jest.fn().mockResolvedValue([])
}));

jest.mock('../controllers/fundController.js', () => ({
  getFundTimeSeries: jest.fn().mockResolvedValue([])
}));

jest.mock('../controllers/bondController.js', () => ({
  getBondTimeSeries: jest.fn().mockResolvedValue([])
}));

jest.mock('../controllers/othersController.js', () => ({
  getOthersTimeSeries: jest.fn().mockResolvedValue([])
}));

const { query } = require('../utils/db.js');

const app = express();
app.use(express.json());
app.get('/summary', getSummaryData);
app.post('/search', getSearchData);
app.get('/timeseries', getTimeSeriesDataInCNY);

describe('Asset Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSummaryData - success', async () => {
    query.mockImplementation((sql) => {
      if (sql.includes('FROM stocks c')) return Promise.resolve([{ ticker: 10000 }]);
      if (sql.includes('FROM cash_snapshot')) return Promise.resolve([{ cash: 2000 }]);
      if (sql.includes('FROM deposit')) return Promise.resolve([{ deposit: 3000 }, { currency_count: 1 }]);
      if (sql.includes('FROM funds')) return Promise.resolve([{ funds: 1500 }, { funds_count: 2 }]);
      if (sql.includes('FROM bonds')) return Promise.resolve([{ bonds: 2500 }, { bonds_count: 1 }]);
      if (sql.includes('FROM others')) return Promise.resolve([{ others: 500 }, { others_count: 1 }]);
      if (sql.includes('stock_name')) return Promise.resolve([{ stock_count: 3 }]);
      if (sql.includes('purchase_price')) return Promise.resolve([{ ticker_earning: 5000 }]);
      if (sql.includes('units')) return Promise.resolve([{ funds_earning: 700 }]);
      if (sql.includes('purchase_amount')) return Promise.resolve([{ others_earning: 300 }]);
    });

    const response = await request(app).get('/summary');
    expect(response.statusCode).toBe(200);
    expect(response.body.stock.amount).toBe("10000.00");
  });

  test('getSearchData - missing search', async () => {
    const response = await request(app).post('/search').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("搜索关键词不能为空");
  });

  test('getTimeSeriesDataInCNY - success', async () => {
    query.mockImplementation((sql) => {
      if (sql.includes('exchange_rates')) {
        return Promise.resolve([{ currency_code: 'USD', rate_to_cny: 7.0 }]);
      }
      return Promise.resolve([]);
    });

    const response = await request(app).get('/timeseries');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('stocks');
    expect(response.body.cash).toEqual([]);
  });
});
