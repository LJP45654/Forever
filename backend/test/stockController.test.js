const {
  getTickerNames,
  getTickerRecords,
  getStockTimeSeries,
  getAllStockTimeSeries,
  getStockTimeSeriesById,
  insertStockRecords,
  deleteStockRecordsById,
  updateStockRecords,
} = require('../controllers/stockController');

const { query } = require('../utils/db');
const stockDataController = require('../controllers/stockDataController');

jest.mock('../utils/db', () => ({ query: jest.fn() }));
jest.mock('../controllers/stockDataController', () => ({
  updateTickersByCode: jest.fn(),
  deleteTickersByCode: jest.fn()
}));

describe('stocksController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  test('getTickerNames should return ticker names', async () => {
    const mockData = [{ currency: 'USD', total_amount: 1000, total_amount_cny: 7000 }];
    query.mockResolvedValueOnce(mockData);

    await getTickerNames(req, res);

    expect(query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getTickerRecords should return all stock records', async () => {
    const mockData = [{ id: 1, stock_name: 'AAPL' }];
    query.mockResolvedValueOnce(mockData);

    await getTickerRecords(req, res);

    expect(query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getStockTimeSeries should return time series', async () => {
    const mockData = [{ date: '2025-01-01', amount: 10000, currency: 'USD' }];
    query.mockResolvedValueOnce(mockData);

    const result = await getStockTimeSeries();

    expect(result).toEqual(mockData);
  });

  test('getAllStockTimeSeries should respond with stock time series', async () => {
    const mockData = [{ date: '2025-01-01', amount: 10000 }];
    query.mockResolvedValueOnce(mockData);

    await getAllStockTimeSeries(req, res);

    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getStockTimeSeriesById should return filtered stock time series', async () => {
    req.params = { id: '1' };
    const mockData = [{ date: '2025-01-01', amount: '1200.00' }];
    query.mockResolvedValueOnce(mockData);

    await getStockTimeSeriesById(req, res);

    expect(query).toHaveBeenCalledWith(expect.any(String), ['1']);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('insertStockRecords should insert and respond', async () => {
    req.body = [{
      stock_name: 'AAPL',
      currency: 'USD',
      quantity: 10,
      purchase_price: 100,
      purchase_date: '2025-01-01',
      stock_code: 'AAPL'
    }];
    stockDataController.deleteTickersByCode.mockResolvedValue();
    stockDataController.updateTickersByCode.mockResolvedValue(105);
    query.mockResolvedValue();

    await insertStockRecords(req, res);

    expect(query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: '1 stocks record(s) inserted successfully.' });
  });

  test('deleteStockRecordsById should delete a record', async () => {
    req.params = { id: '5' };
    query.mockResolvedValueOnce({ affectedRows: 1 });

    await deleteStockRecordsById(req, res);

    expect(query).toHaveBeenCalledWith(expect.any(String), ['5']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Stock record deleted successfully.' });
  });

  test('updateStockRecords should update record', async () => {
    req.body = {
      id: 1,
      stock_name: 'AAPL',
      currency: 'USD',
      quantity: 5,
      purchase_price: 120,
      purchase_date: '2025-01-01',
      stock_code: 'AAPL'
    };
    query.mockResolvedValueOnce([{ current_price: 110 }]); // getCurrentPrice
    query.mockResolvedValue(); // update

    await updateStockRecords(req, res);

    expect(query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Stock record updated successfully.' });
  });
});
