import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import Beer from '../lib/models/Beer.js';

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

  it('returns a single beer by id via GET', async () => {
    const beer = await Beer.insert({ name: 'beer1', style: 'pale', hops: 'simcoe'  });

    const res = await request(app).get(`/api/v1/beers/${beer.id}`);

    expect(res.body).toEqual(beer);
  });

  it('returns all beers via GET', async () => {
    const beer1 = await Beer.insert({ name: 'beer1', style: 'pale', hops: 'simcoe' });
    const beer2 = await Beer.insert({ name: 'beer2', style: 'ipa', hops: 'mosaic'  });
    const beer3 = await Beer.insert({ name: 'beer3', style: 'double ipa', hops: 'vic secret' });

    return request(app)
      .get('/api/v1/beers')
      .then((res) => {
        expect(res.body).toEqual([beer1, beer2, beer3]);
      });
  });

  it('updates a beer by id via PUT', async () => {
    const beer = await Beer.insert({ name: 'beer1', style: 'pale', hops: 'simcoe' });

    const res = await request(app)
      .put(`/api/v1/beers/${beer.id}`)
      .send({ hops: 'citra' });

    expect(res.body).toEqual({ ...beer, hops: 'citra' });
  });

  it('deletes an existing beer by id', async () => {
    const beer = await Beer.insert({ name: 'beer1', style: 'pale', hops: 'simcoe' });

    const res = await request(app).delete(`/api/v1/beers/${beer.id}`);

    expect(res.body).toEqual({
      message: `${beer.name} has been deleted!`
    });
  });

});
