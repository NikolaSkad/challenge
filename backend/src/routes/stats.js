const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cache = null;

// Invalidate cache when file changes
fs.watch(DATA_PATH, () => {
  cache = null;
});

// GET /api/stats
router.get('/', (req, res, next) => {
  if (cache) return res.json(cache);

  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    cache = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    };

    res.json(cache);
  });
});

module.exports = router;