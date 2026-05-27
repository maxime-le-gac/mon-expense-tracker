let expense;

beforeEach(() => {
  process.env.TEST_DB_PATH = ':memory:';
  jest.resetModules();
  expense = require('../../src/models/expense');
});

afterAll(() => {
  delete process.env.TEST_DB_PATH;
});

describe('getAll', () => {
  test('returns empty array on fresh DB', () => {
    expect(expense.getAll()).toEqual([]);
  });

  test('returns rows ordered by date DESC', () => {
    expense.add({ amount: 10, category: 'Food', date: '2026-05-01', description: 'lunch' });
    expense.add({ amount: 20, category: 'Transport', date: '2026-05-10', description: null });
    const rows = expense.getAll();
    expect(rows).toHaveLength(2);
    expect(rows[0].date).toBe('2026-05-10');
    expect(rows[1].date).toBe('2026-05-01');
  });
});

describe('add', () => {
  test('returns object with positive id', () => {
    const result = expense.add({ amount: 15.5, category: 'Alimentation', date: '2026-05-15', description: 'épicerie' });
    expect(result).toHaveProperty('id');
    expect(result.id).toBeGreaterThan(0);
  });

  test('inserts with null description when omitted', () => {
    expense.add({ amount: 5, category: 'Café', date: '2026-05-20' });
    const rows = expense.getAll();
    expect(rows[0].description).toBeNull();
  });
});

describe('getTotalsByCategory', () => {
  test('returns correct aggregates for given month', () => {
    expense.add({ amount: 10, category: 'Food', date: '2026-05-01' });
    expense.add({ amount: 5, category: 'Food', date: '2026-05-15' });
    expense.add({ amount: 20, category: 'Transport', date: '2026-05-10' });
    const totals = expense.getTotalsByCategory('2026-05');
    expect(totals).toHaveLength(2);
    const food = totals.find(r => r.category === 'Food');
    expect(food.total).toBeCloseTo(15);
  });

  test('returns empty array for month with no data', () => {
    expect(expense.getTotalsByCategory('2099-01')).toEqual([]);
  });
});
