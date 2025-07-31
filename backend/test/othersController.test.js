const othersController = require('../controllers/othersController');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({
  query: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Others Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addOtherRecord - success', async () => {
    const req = {
      body: {
        name: 'Other Asset',
        currency: 'USD',
        purchase_amount: 1000,
        purchase_date: '2024-01-01',
        current_amount: 1200
      }
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce();

    await othersController.addOtherRecord(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Record added successfully' });
  });

  test('deleteOtherRecord - success', async () => {
    const req = { body: { id: 5 } };
    const res = mockRes();

    db.query.mockResolvedValueOnce();

    await othersController.deleteOtherRecord(req, res);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE'), [5]);
    expect(res.json).toHaveBeenCalledWith({ message: 'Record deleted successfully' });
  });

  test('updateOtherRecord - success', async () => {
    const req = {
      body: {
        id: 2,
        name: 'Updated Name',
        currency: 'CNY',
        purchase_amount: 200,
        purchase_date: '2024-06-01',
        current_amount: 250
      }
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce();

    await othersController.updateOtherRecord(req, res);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), expect.any(Array));
    expect(res.json).toHaveBeenCalledWith({ message: 'Record updated successfully' });
  });

  test('getAllOtherRecords - success', async () => {
    const req = {};
    const res = mockRes();
    const mockData = [{ id: 1, name: 'Test' }];

    db.query.mockResolvedValueOnce(mockData);

    await othersController.getAllOtherRecords(req, res);

    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getOthersTimeSeries - return value', async () => {
    const mockResult = [{ date: '2024-01-01', amount: 1000, currency: 'USD' }];
    db.query.mockResolvedValueOnce(mockResult);

    const result = await othersController.getOthersTimeSeries();

    expect(result).toEqual(mockResult);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT DATE_FORMAT'));
  });
});
