/* eslint-disable prefer-destructuring */
import supertest from 'supertest';
import app from '../index';

const server = () => supertest(app);
const url = '/api/v1/payments/subscribe';

let token ;

describe('Books tests', () => {
  beforeAll((done) => {
    server()
    .post('/api/v1/auth/signin')
    .send({
      email: 'extender@test.com',
      password: 'PassWord123..'
    })
    .end((_regErr, res) => {
      token = res.body.data.token;
      done();
    })
  });
  it('Should reder the payment page successfully', (done) => {
    server()
    .get(`${url}`)
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    })
  });
  it('Should verify a payment with a valid reference number', (done) => {
    server()
    .post(`${url}`)
    .send({reference: '325682378'})
    .end((err, res) => {
      expect(res.statusCode).toEqual(200); 
      done();
    })
  });
});

