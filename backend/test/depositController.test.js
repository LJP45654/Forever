const depositController = require('../controllers/depositController');
const db = require('../utils/db');

// Mock the query function
jest.mock('../utils/db', () => ({
  query: jest.fn()
}));

// Mock response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('Deposit Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });



  describe('insertDepositRecord', () => {
    it('should insert a deposit record and return success', async () => {
      const req = {
        body: {
          start_date: '2025-05-01',
          principal: 5000,
          currency: 'USD',
          end_date: '2025-11-01',
          interest_rate: 1.5,
          description: 'Test deposit'
        }
      };
      db.query.mockResolvedValue({ insertId: 123 });

      const res = mockResponse();
      await depositController.insertDepositRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deposit record created successfully',
        id: 123
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: {} };
      const res = mockResponse();

      await depositController.insertDepositRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: start_date, principal, and currency are required'
      });
    });
  });

  describe('deleteDepositRecordById', () => {
    it('should delete a deposit record if it exists', async () => {
      const req = { params: { id: '1' } };
      const res = mockResponse();

      db.query
        .mockResolvedValueOnce([{ id: 1 }]) // check existing
        .mockResolvedValueOnce({ affectedRows: 1 }); // delete

      await depositController.deleteDepositRecordById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deposit record deleted successfully',
        affectedRows: 1
      });
    });

    it('should return 404 if record not found', async () => {
      const req = { params: { id: '999' } };
      const res = mockResponse();

      db.query.mockResolvedValue([]);

      await depositController.deleteDepositRecordById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Deposit record not found'
      });
    });
  });

  describe('updateDepositRecordById', () => {
    it('should update an existing record', async () => {
      const req = {
        params: { id: '1' },
        body: { principal: 8000 }
      };
      const res = mockResponse();

      db.query
        .mockResolvedValueOnce([{ id: 1 }]) // check exists
        .mockResolvedValueOnce({ affectedRows: 1 }); // update

      await depositController.updateDepositRecordById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deposit record updated successfully',
        affectedRows: 1
      });
    });

    it('should return 400 if no update fields are provided', async () => {
      const req = {
        params: { id: '1' },
        body: {}
      };
      const res = mockResponse();

      await depositController.updateDepositRecordById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No fields provided for update'
      });
    });
  });
});
