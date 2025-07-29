const { query } = require('../utils/db.js');
const { getAllCashRecords,getCashCurrency } = require('../controllers/cashController.js');

// 模拟数据库查询模块
jest.mock('../utils/db.js', () => ({
  query: jest.fn()
}));

describe('getAllCashRecords', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    
    // 创建 mock 请求和响应对象
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  it('should return all cash records successfully', async () => {
    // 模拟数据库返回的数据
    const mockCashRecords = [
      { id: 1, amount: 100, description: 'Test record 1' },
      { id: 2, amount: 200, description: 'Test record 2' }
    ];
    
    // 设置 query mock 的返回值
    query.mockResolvedValue(mockCashRecords);

    await getAllCashRecords(mockReq, mockRes);

    // 验证数据库查询是否被调用
    expect(query).toHaveBeenCalledWith('SELECT * FROM cash');
    
    // 验证响应
    expect(mockRes.json).toHaveBeenCalledWith(mockCashRecords);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should handle database query errors', async () => {
    // 模拟数据库错误
    const mockError = new Error('Database connection failed');
    query.mockRejectedValue(mockError);

    // 模拟 console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getAllCashRecords(mockReq, mockRes);

    // 验证错误处理
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching cash records:',
      mockError
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database query failed' });

    // 恢复 console.error
    consoleSpy.mockRestore();
  });

  it('should handle empty result set', async () => {
    // 模拟空结果集
    query.mockResolvedValue([]);

    await getAllCashRecords(mockReq, mockRes);

    expect(query).toHaveBeenCalledWith('SELECT * FROM cash');
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });
});

describe('getCashCurrency', () => {
  it('should return the cash currency', async () => {
    const mockReq = {};
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    const mockCurrency = 'USD';

    // 模拟数据库返回的数据
    const mockCashCurrency = [
      { currency: mockCurrency }
    ];

    // 设置 query mock 的返回值
    query.mockResolvedValue(mockCashCurrency);

    await getCashCurrency(mockReq, mockRes);

    // 验证数据库查询是否被调用
    expect(query).toHaveBeenCalledWith('SELECT DISTINCT currency FROM cash');
    expect(mockRes.json).toHaveBeenCalledWith(mockCashCurrency);
    expect(mockRes.status).not.toHaveBeenCalled();  
});})

