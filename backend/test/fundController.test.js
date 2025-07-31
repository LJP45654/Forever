const {
  getFundTimeSeries,
  getAllFundRecord,
  deleteFundRecordById,
  updateFundRecordById,
  insertFundRecord
} = require('../controllers/fundController');

const { query } = require('../utils/db');
jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Fund Controller', () => {

  describe('getFundTimeSeries', () => {
    it('should return time series data', async () => {
      const mockData = [{ date: '2025-01-01', amount: 1000, currency: 'USD' }];
      query.mockResolvedValueOnce(mockData);

      const result = await getFundTimeSeries();
      expect(query).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllFundRecord', () => {
    let req, res;
    beforeEach(() => {
      req = {};
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should return all fund records with formatted date', async () => {
      const mockData = [
        { id: 1, purchase_date: new Date('2025-03-01T00:00:00Z') }
      ];
      query.mockResolvedValueOnce(mockData);

      await getAllFundRecord(req, res);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, purchase_date: '2025-03-01' }
      ]);
    });

    it('should handle query error', async () => {
      query.mockRejectedValueOnce(new Error('DB Error'));
      await getAllFundRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to insert records' });
    });
  });

  describe('insertFundRecord', () => {
    let req, res;
    beforeEach(() => {
      req = {
        body: {
          fund_name: 'ABC Fund',
          units: 100,
          purchase_price: 10,
          currency: 'USD',
          purchase_date: '2025-05-01',
          description: 'Long term'
        }
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should insert and return new fund record', async () => {
      query
        .mockResolvedValueOnce({ insertId: 1 }) // insert result
        .mockResolvedValueOnce([{ id: 1, purchase_date: new Date('2025-05-01T00:00:00Z') }]); // inserted record

      await insertFundRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Fund record created successfully',
        record: { id: 1, purchase_date: '2025-05-01' }
      });
    });

    it('should return 400 if missing required fields', async () => {
      req.body = { fund_name: 'Missing Fields' };
      await insertFundRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('should handle insert error', async () => {
      query.mockRejectedValueOnce(new Error('Insert failed'));
      await insertFundRecord(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to insert fund record' });
    });
  });

  describe('deleteFundRecordById', () => {
    let req, res;
    beforeEach(() => {
      req = { params: { id: '1' } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should delete fund record if exists', async () => {
      query
        .mockResolvedValueOnce([{ id: 1 }]) // check record
        .mockResolvedValueOnce({ affectedRows: 1 }); // delete record

      await deleteFundRecordById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        affectedRows: 1
      }));
    });

    it('should return 404 if record not found', async () => {
      query.mockResolvedValueOnce([]);
      await deleteFundRecordById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if ID is invalid', async () => {
      req.params.id = 'abc';
      await deleteFundRecordById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateFundRecordById', () => {
    let req, res;
    beforeEach(() => {
      req = {
        params: { id: '1' },
        body: {
          fund_name: 'Updated Fund',
          units: 200,
          purchase_price: 12,
          currency: 'CNY',
          purchase_date: '2025-07-01',
          description: 'Updated'
        }
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    it('should update fund record if exists', async () => {
      query
        .mockResolvedValueOnce([{ id: 1 }]) // check record exists
        .mockResolvedValueOnce({ affectedRows: 1 }) // update
        .mockResolvedValueOnce([{ id: 1, purchase_date: new Date('2025-07-01T00:00:00Z') }]); // get updated

      await updateFundRecordById(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Fund record updated successfully',
        record: expect.objectContaining({ purchase_date: '2025-07-01' })
      }));
    });

    it('should return 404 if record does not exist', async () => {
      query.mockResolvedValueOnce([]); // no record
      await updateFundRecordById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if no update fields are provided', async () => {
      req.body = {};
      await updateFundRecordById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle update error', async () => {
      query.mockRejectedValueOnce(new Error('Update failed'));
      await updateFundRecordById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
