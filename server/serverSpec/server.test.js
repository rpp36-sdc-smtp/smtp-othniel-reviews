const server = require('../server.js');
const req = require('supertest');

describe('Server responses', () => {
  it('should respond with a status code of 200 at /', async () => {
    var res = await req(server).get('/');
    expect(res.response).toEqual(200);
  });
});