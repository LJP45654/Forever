const { getOthersTimeSeries, getAllOtherRecords } = require('../controllers/othersController');
const { query } = require('../utils/db');

jest.mock('../utils/db', () => ({
  query: jest.fn()
}));

describe('othersController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  test('getOthersTimeSeries should return formatted time series', async () => {
    const mockData = [
      { date: '2025-01-01', amount: 1000, currency: 'USD' }
    ];
    query.mockResolvedValueOnce(mockData);

    const result = await getOthersTimeSeries();

    expect(query).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  test('getAllOtherRecords should return all records', async () => {
    const mockData = [
      { id: 1, currency: 'USD', purchase_amount: 1000, purchase_date: '2025-01-01' }
    ];
    query.mockResolvedValueOnce(mockData);

    await getAllOtherRecords(req, res);

    expect(query).toHaveBeenCalledWith(expect.any(String));
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getAllOtherRecords should handle errors gracefully', async () => {
    const error = new Error('Database failure');
    query.mockRejectedValueOnce(error);

    await getAllOtherRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to insert records' });
  });
});
