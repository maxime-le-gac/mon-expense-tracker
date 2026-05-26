const express = require('express');
const router = express.Router();
const { getAll, add, getTotalsByCategory } = require('../models/expense');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

function isValidMonth(s) {
  if (!MONTH_RE.test(s)) return false;
  const mm = parseInt(s.slice(5), 10);
  return mm >= 1 && mm <= 12;
}

router.get('/', (req, res) => {
  const expenses = getAll();
  res.render('index', { expenses });
});

router.get('/add', (req, res) => {
  res.render('add', { errors: [], values: {} });
});

router.post('/add', (req, res) => {
  const { category, date, description } = req.body;
  const rawAmount = req.body.amount;
  const errors = [];

  const amount = parseFloat(rawAmount);
  if (!rawAmount || !isFinite(amount) || amount <= 0) {
    errors.push('Le montant doit être un nombre positif');
  }

  if (!category || !category.trim()) {
    errors.push('La catégorie est obligatoire');
  }

  if (!date || !DATE_RE.test(date)) {
    errors.push('La date doit être au format YYYY-MM-DD');
  }

  if (errors.length > 0) {
    return res.render('add', { errors, values: req.body });
  }

  add({ amount, category: category.trim(), date, description });
  res.redirect('/');
});

router.get('/stats', (req, res) => {
  const month = isValidMonth(req.query.month)
    ? req.query.month
    : new Date().toISOString().slice(0, 7);
  const rows = getTotalsByCategory(month);
  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
  res.render('stats', { rows, grandTotal, month });
});

module.exports = router;
