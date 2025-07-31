const stockController = require('../controllers/stockController');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({
  query: jest.fn(),
}));

jest.mock('../controllers/stockDataController', () => ({
  updateTickersByCode: jest.fn().mockResolvedValue(123.45),
  deleteTickersByCode: jest.fn().mockResolvedValue(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Stock Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ insertStockRecords
  it('should insert stock records successfully', async () => {
    const req = {
      body: [{
        stock_name: 'Apple',
        currency: 'USD',
        quantity: 10,
        purchase_price: 100,
        purchase_date: '2024-01-01',
        stock_code: 'AAPL'
      }]
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce(); // delete
    db.query.mockResolvedValueOnce(); // insert

    await stockController.insertStockRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: '1 stocks record(s) inserted successfully.'
    });
  });


  // ❌ 错误处理测试示例
  it('should handle invalid stock ID on delete', async () => {
    const req = { body: { id: 'abc' } };
    const res = mockRes();

    await stockController.deleteStockRecordsById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing stock ID.' });
  });
});
