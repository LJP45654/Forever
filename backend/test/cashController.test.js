const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Apply middleware
app.use(bodyParser.json());

// Mock DB and controller
jest.mock('../utils/db.js', () => ({
  query: jest.fn()
}));

const { query } = require('../utils/db.js');
const cashController = require('../controllers/cashController');

// Register endpoints for testing
app.get('/cash', cashController.getAllCashRecords);
app.post('/cash', cashController.insertCashRecords);
app.delete('/cash', cashController.deleteCashRecords);
app.put('/cash', cashController.updateCashRecords);
app.get('/cash/time-series', cashController.getAllCashTimeSeries);
app.get('/cash/balance', cashController.getBalanceSnapshot);

// TEST SUITE

describe('Cash Controller', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /cash returns records with formatted timestamp', async () => {
    query.mockResolvedValueOnce([
      { id: 1, timestamp: '2025-07-01', currency: 'USD', delta_amount: 100, note: 'Test' }
    ]);

    const res = await request(app).get('/cash');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(query).toHaveBeenCalled();
  });

  test('POST /cash inserts records', async () => {
    query.mockResolvedValueOnce({ affectedRows: 2 });
    query.mockResolvedValueOnce([]); // updateBalanceSnapshot mock

    const res = await request(app).post('/cash').send([
      { currency: 'USD', delta_amount: 100, note: 'Deposit' },
      { currency: 'CNY', delta_amount: 50 }
    ]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(query).toHaveBeenCalled();
  });

  test('DELETE /cash deletes records', async () => {
    query.mockResolvedValueOnce({ affectedRows: 2 });
    query.mockResolvedValueOnce([]); // updateBalanceSnapshot mock

    const res = await request(app).delete('/cash').send({ ids: [1, 2] });
    expect(res.statusCode).toBe(200);
    expect(res.body.deletedCount).toBe(2);
  });

  test('PUT /cash updates a record', async () => {
    query.mockResolvedValueOnce({ affectedRows: 1 });
    query.mockResolvedValueOnce([]); // updateBalanceSnapshot mock

    const res = await request(app).put('/cash').send([
      { id: 1, delta_amount: 200, note: 'Updated Note' }
    ]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /cash/time-series returns time series', async () => {
    query.mockResolvedValueOnce([
      { date: '2025-07-01', amount: 1000.5 }
    ]);

    const res = await request(app).get('/cash/time-series');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /cash/balance returns balance snapshot', async () => {
    query.mockResolvedValueOnce([
      { currency: 'USD', balance: 100, balance_cny: 720 }
    ]);

    const res = await request(app).get('/cash/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].currency).toBe('USD');
  });
});
