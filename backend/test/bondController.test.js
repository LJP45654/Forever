const {
  getBondTimeSeries,
  getAllBondRecords,
  addBondRecord,
  deleteBondRecord,
  updateBondRecord
} = require('../controllers/bondController');

const { query } = require('../utils/db');
jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Bond Controller', () => {

  describe('getBondTimeSeries', () => {
    it('should return time series bond data', async () => {
      const mockData = [
        { date: '2025-01-01', amount: 10000, currency: 'USD' }
      ];
      query.mockResolvedValueOnce(mockData);

      const result = await getBondTimeSeries();
      expect(query).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllBondRecords', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should return all bond records', async () => {
      const mockData = [
        {
          bond_name: 'Gov Bond',
          rate: 2.5,
          start_date: '2025-01-01',
          end_date: '2026-01-01',
          amount: 5000,
          currency: 'USD',
          interest: 100
        }
      ];
      query.mockResolvedValueOnce(mockData);

      await getAllBondRecords(req, res);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle query error', async () => {
      query.mockRejectedValueOnce(new Error('Query failed'));

      await getAllBondRecords(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database query failed' });
    });
  });

  describe('addBondRecord', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          bond_name: 'Corporate Bond',
          currency: 'CNY',
          amount: 10000,
          rate: 3.5,
          start_date: '2025-04-01',
          end_date: '2026-04-01'
        }
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should insert a new bond record', async () => {
      query.mockResolvedValueOnce({});

      await addBondRecord(req, res);
      expect(query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bond record added successfully' });
    });

    it('should handle insert error', async () => {
      query.mockRejectedValueOnce(new Error('Insert failed'));

      await addBondRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add bond record' });
    });
  });

  describe('deleteBondRecord', () => {
    let req, res;

    beforeEach(() => {
      req = { params: { id: '1' } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should delete the bond record', async () => {
      query.mockResolvedValueOnce({});

      await deleteBondRecord(req, res);
      expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM bonds'), ['1']);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bond record deleted successfully' });
    });

    it('should handle delete error', async () => {
      query.mockRejectedValueOnce(new Error('Delete failed'));

      await deleteBondRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete bond record' });
    });
  });

  describe('updateBondRecord', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: { id: '1' },
        body: {
          bond_name: 'Updated Bond',
          currency: 'EUR',
          amount: 7000,
          rate: 4.2,
          start_date: '2025-06-01',
          end_date: '2026-06-01'
        }
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should update the bond record', async () => {
      query.mockResolvedValueOnce({});

      await updateBondRecord(req, res);
      expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE bonds'), expect.any(Array));
      expect(res.json).toHaveBeenCalledWith({ message: 'Bond record updated successfully' });
    });

    it('should handle update error', async () => {
      query.mockRejectedValueOnce(new Error('Update failed'));

      await updateBondRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update bond record' });
    });
  });

});
