const server = require('../server.js');
const req = require('supertest');
const pool = require('../../database/index.js');

describe('Server responses', () => {
  it('should respond with a status code of 200 at /', async () => {
    const res = await req(server).get('/');
    expect(res.status).toEqual(200);
  });
});

describe('Get routes for reviews', () => {
  it('Should get the correct reviews from the given product id', async () => {
    const res = await req(server).get('/reviews?product_id=1000011');
    console.log(res);
    expect(res.body.product).toEqual('1000011');
  });

  it('Should contain a photos array within the reviews object', async () => {
    const res = await req(server).get('/reviews?product_id=1000011');
    expect(Array.isArray(res.body.results[0].photos)).toBeTruthy();
  });

  it('Should have default page and count of 0 and 5 respectively', async () => {
    const res = await req(server).get('/reviews?product_id=1000011');
    // console.log(res.body);
    expect(res.body.page).toEqual(0);
    expect(res.body.count).toEqual(5);
  });

  it('Should sort results by date', async () => {
    const res = await req(server).get('/reviews?product_id=1000011&sort=newest');
    let i = 0;
    while(i > res.body.results.length - 1) {
      expect(res.body.results[i].date > res.body.results[i + 1].date).toBeTruthy();
      i++;
    }
  });

  it('Should sort results by helpfulness', async () => {
    const res = await req(server).get('/reviews?product_id=1000011&sort=helpfulness');
    let i = 0;
    while(i > res.body.results.length - 1) {
      expect(res.body.results[i].helpfulness >= res.body.results[i + 1].helpfulness).toBeTruthy();
      i++;
    }
  });

  it('Should return an empty results array if there are no reviews', async () => {
    const res = await req(server).get('/reviews?product_id=1000012');
    expect(Array.isArray(res.body.results)).toBeTruthy();
    expect(res.body.results.length).toEqual(0);
  });

  it('Should respond with a 400 error with a bad request', async () => {
    const res = await req(server).get('/reviews?product_id=qwerty');
    expect(res.status).toEqual(400);
  });
});

describe('Post routes for reviews', () => {
  const body = {
    'product_id': 1000011,
    'rating':  1,
    'summary': 'summary here',
    'body': 'body here',
    'recommend': true,
    'name': 'test',
    'email': 'test@tester.com',
    'photos': ['photo1.jpg', 'photo2.png'],
    'characteristics': {'3347676':5, '3347677':2, '3347678':3, '3347679':1}
  };

  afterEach(async () => {
    await pool.query('DELETE from photos where id > 2742540; \
    DELETE from characteristicreview where id > 19327575; \
    DELETE from reviews where id > 5774952;');
  });

  it('Should be able to add reviews', async () => {
    const res = await req(server).post('/reviews').send(body);
    expect(res.status).toEqual(201);
  });

  it('Should not add a review if the body is bad', async () => {
    const res = await req(server).post('/reviews').send({'product_id': 'string'});
    expect(res.status).toEqual(400);
  });

});

describe('Get request for reviews/meta route', () => {
  it('Should get the characteristics of product id', async () => {
    const res = await req(server).get('/reviews/meta?product_id=1000011');
    expect(res.body.product_id).toEqual('1000011');
  });
});