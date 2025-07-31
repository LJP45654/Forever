// __tests__/bondController.test.js
const { getBondTimeSeries, getAllBondRecords } = require('../controllers/bondController');
const { query } = require('../utils/db');

jest.mock('../utils/db', () => ({
  query: jest.fn(),
}));

describe('Bond Controller', () => {
  describe('getBondTimeSeries', () => {
    it('should return bond time series from DB', async () => {
      const mockData = [
        { date: '2025-01-01', amount: 1000, currency: 'USD' },
        { date: '2025-02-01', amount: 2000, currency: 'EUR' }
      ];

      query.mockResolvedValueOnce(mockData);

      const result = await getBondTimeSeries();

      expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT DATE_FORMAT'));
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllBondRecords', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
    });

    it('should return all bond records with formatted dates', async () => {
      const mockData = [
        {
          bond_name: 'Bond A',
          rate: 3.5,
          start_date: '2025-01-01',
          end_date: '2026-01-01',
          amount: 10000,
          currency: 'USD',
          interest: 350
        }
      ];

      query.mockResolvedValueOnce(mockData);

      await getAllBondRecords(req, res);

      expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT b.bond_name'));
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle DB errors and return 500', async () => {
      query.mockRejectedValueOnce(new Error('DB error'));

      await getAllBondRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database query failed' });
    });
  });
});
