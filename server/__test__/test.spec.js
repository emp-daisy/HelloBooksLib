import supertest from 'supertest';
import truncate from "./truncate";
import app from '../index';

const server = () => supertest(app);
const url = '/api/v1'

describe('Welcome to helo books', () => {
  it('Should return a message on app start', (done) => {
    server().get(`${url}/`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('This is Hello books');
      done();
      expect(res.body).toMatchSnapshot()
    });
  });

  it('Should return an error message for an invalid URL', (done) => {
    server().get(`${url}/unknown`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Sorry, the requested endpoint does not exist on our server');
      done();
      expect(res.body).toMatchSnapshot()
    });
  });
});


describe('test for user signup', () => {
  beforeEach(async () => {
       await truncate();
      });
  it('Should reigister a user when all required input is supplied', async (done) => {
    server()
    .post(`${url}/auth/signup`)
    .send({
      firstName: 'Mat',
      lastName: 'Eniola',
      email: 'testing1@example.com',
      password: 'password',
    })
    .end((err, res) => {
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('User added successfully');
      expect(res.body.status).toEqual(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('firstName');
      expect(res.body.data).toHaveProperty('lastName');
      expect(res.body.data).toHaveProperty('email');
      done();
    });
  });
});

describe('test for user signup Validation', () => {
  beforeEach(async () => {
       await truncate();
      });
  it('Should throw an error if the input is unsupported', async (done) => {
    server()
    .post(`${url}/auth/signup`)
    .send({
      firstName: '',
      lastName: '',
      email: 'testin.com',
      password: '',
    })
    .end((err, res) => {
      expect(res.statusCode).toEqual(400);
      expect(res.body.error[0]).toEqual('First Name should not be left empty: Please input firstName');
      expect(res.body.error[1]).toEqual('Last name should not be left empty: Please input lastName');
      expect(res.body.error[2]).toEqual('Email is not valid: Please input a valid email address');
      expect(res.body.error[3]).toEqual('Password should not be empty: Please input password');
      done();
    });
  });
});
