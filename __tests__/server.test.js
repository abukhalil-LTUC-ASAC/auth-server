'use strict';

const {server} = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
require('dotenv').config();
const user = {username: 'yahya', password: '2u71jj3'};

describe('Testing server.js class-11', () => {
  it('Signup works properly ', async () => {
    let result = await mockRequest.post('/signup').send(user);
    expect(result.status).toEqual(200);
  });

  it('Signin works properly ', async () => {
    let signup = await mockRequest.post('/signup').send(user);
    let signin = await mockRequest.post('/signin').auth('yahya', '2u71jj3');
    expect(signin.status).toEqual(200);
  });

  it('Signin does not work properly without the right data', async () => {
    let signup = await mockRequest.post('/signup').send(user);
    let signin = await mockRequest.post('/signin').auth('yaya', '2u71jj3');
    expect(signin.status).toEqual(401);
  });

  it('Should not be able to get users without authorization ', async () => {
    let request = await mockRequest.get('/users');
    expect(request.status).toEqual(500)
  });

  it('Should respond with 404 for nonexistent', async ()=>{
    const data = await mockRequest.get('/not');
    expect(data.statusCode).toBe(404);
  });
});
