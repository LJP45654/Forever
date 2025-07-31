// __tests__/fundController.test.js
const { getFundTimeSeries, getAllFundRecord } = require('../controllers/fundController');
const { query } = require('../utils/db');

jest.mock('../utils/db', () => ({
  query: jest.fn(),
}));

describe('Fund Controller', () => {
  describe('getFundTimeSeries', () => {
    it('should return time series of fund data', async () => {
      const mockData = [
        { date: '2025-01-01', amount: 3000, currency: 'USD' },
        { date: '2025-02-01', amount: 5000, currency: 'CNY' }
      ];

      query.mockResolvedValueOnce(mockData);

      const result = await getFundTimeSeries();

      expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT DATE_FORMAT'));
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllFundRecord', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
    });

    it('should return formatted fund records', async () => {
      const mockData = [
        {
          id: 1,
          fund_name: 'Growth Fund',
          currency: 'USD',
          purchase_price: 10.1234,
          units: 100,
          purchase_date: new Date('2025-03-01T00:00:00Z')
        }
      ];

      query.mockResolvedValueOnce(mockData);

      await getAllFundRecord(req, res);

      expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM funds'));

      expect(res.json).toHaveBeenCalledWith([
        {
          ...mockData[0],
          purchase_date: '2025-03-01'
        }
      ]);
    });

    it('should handle errors and respond with 500', async () => {
      query.mockRejectedValueOnce(new Error('DB failed'));

      await getAllFundRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to insert records' });
    });
  });
});
