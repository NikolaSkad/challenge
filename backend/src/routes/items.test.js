const request = require('supertest');
const express = require('express');
const itemsRouter = require('./items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('GET /api/items', () => {
  it('returns paginated items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters by search query', async () => {
    const res = await request(app).get('/api/items?q=Laptop');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name).toMatch(/Laptop/i);
  });

  it('returns empty data for unmatched search', async () => {
    const res = await request(app).get('/api/items?q=zzznomatch');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});

describe('GET /api/items/:id', () => {
  it('returns a single item', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('returns 404 for missing item', async () => {
    const res = await request(app).get('/api/items/9999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/items', () => {
  it('creates a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item', price: 99, category: 'Electronics' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Item');
    expect(res.body.category).toBe('Electronics');
  });

  it('returns 400 if name or price or category missing', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'No Price' });
    expect(res.status).toBe(400);
  });
});