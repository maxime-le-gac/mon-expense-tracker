const request = require('supertest');
const app = require('../../src/app');
const expenseModel = require('../../src/models/expense');

jest.mock('../../src/models/expense');

beforeEach(() => {
  jest.clearAllMocks();
  expenseModel.getAll.mockReturnValue([]);
  expenseModel.add.mockReturnValue({ id: 1 });
  expenseModel.getTotalsByCategory.mockReturnValue([]);
});

describe('GET /', () => {
  test('returns 200 and calls getAll', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(expenseModel.getAll).toHaveBeenCalledTimes(1);
  });
});

describe('GET /add', () => {
  test('returns 200', async () => {
    const res = await request(app).get('/add');
    expect(res.status).toBe(200);
  });
});

describe('POST /add', () => {
  test('valid data redirects to / and calls add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ amount: '10', category: 'Food', date: '2026-05-01' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(expenseModel.add).toHaveBeenCalledTimes(1);
  });

  test('missing amount returns 200 and does not call add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ category: 'Food', date: '2026-05-01' });
    expect(res.status).toBe(200);
    expect(expenseModel.add).not.toHaveBeenCalled();
  });

  test('negative amount returns 200 and does not call add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ amount: '-5', category: 'Food', date: '2026-05-01' });
    expect(res.status).toBe(200);
    expect(expenseModel.add).not.toHaveBeenCalled();
  });

  test('zero amount returns 200 and does not call add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ amount: '0', category: 'Food', date: '2026-05-01' });
    expect(res.status).toBe(200);
    expect(expenseModel.add).not.toHaveBeenCalled();
  });

  test('malformed date returns 200 and does not call add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ amount: '10', category: 'Food', date: '2026/05/01' });
    expect(res.status).toBe(200);
    expect(expenseModel.add).not.toHaveBeenCalled();
  });

  test('empty category returns 200 and does not call add', async () => {
    const res = await request(app)
      .post('/add')
      .type('form')
      .send({ amount: '10', category: '', date: '2026-05-01' });
    expect(res.status).toBe(200);
    expect(expenseModel.add).not.toHaveBeenCalled();
  });
});

describe('GET /stats', () => {
  test('no param uses current month', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(expenseModel.getTotalsByCategory).toHaveBeenCalledTimes(1);
    const calledWith = expenseModel.getTotalsByCategory.mock.calls[0][0];
    expect(calledWith).toMatch(/^\d{4}-\d{2}$/);
  });

  test('valid month param is passed to getTotalsByCategory', async () => {
    const res = await request(app).get('/stats?month=2026-05');
    expect(res.status).toBe(200);
    expect(expenseModel.getTotalsByCategory).toHaveBeenCalledWith('2026-05');
  });

  test('invalid month falls back to current month', async () => {
    const res = await request(app).get('/stats?month=invalid');
    expect(res.status).toBe(200);
    const calledWith = expenseModel.getTotalsByCategory.mock.calls[0][0];
    expect(calledWith).not.toBe('invalid');
    expect(calledWith).toMatch(/^\d{4}-\d{2}$/);
  });
});
