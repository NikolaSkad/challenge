const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

async function readData() {
  const raw = await fs.readFile(DATA_PATH);
  return JSON.parse(raw);
}

async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { q, page = 1, limit = 10 } = req.query;
    let results = data;

    if (q) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const paginated = results.slice(start, start + limitNum);

    res.json({
      total: results.length,
      page: pageNum,
      limit: limitNum,
      data: paginated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    if (!item.name || !item.price) {
      const err = new Error('name and price are required');
      err.status = 400;
      throw err;
    }
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;