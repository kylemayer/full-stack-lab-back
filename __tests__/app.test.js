import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
// import Beer from '../lib/models/Beer.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a single beer via POST', async () => {
    const beer = { name: 'beer', style: 'pilsner', hops: 'noble' };
    const res = await request(app).post('/api/v1/beers').send(beer);

    expect(res.body).toEqual({
      id: '1',
      ...beer
    });
  });


});
