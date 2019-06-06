import supertest from 'supertest';
import app from '../index';
import author from './mock_data/authors.mock';
import mockUser from './mock_data/mock_users';


const server = () => supertest(app);
const url = '/api/v1';

describe('Authors tests', () => {
  describe(`${url}/authors`, () => {
    it('Should add a new author to the authors table', async done => {
      server()
        .post(`${url}/authors`)
        .send(author.validInputs)
        .end((err, res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('Author added successfully');
          expect(res.body.data).toHaveProperty('firstName');
          expect(res.body.data).toHaveProperty('lastName');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('Should not add an author with incomplete form data', async done => {
      server()
        .post(`${url}/authors`)
        .send(author.incompleteData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error[0]).toEqual('First Name should not be left empty: Please input firstName');
          expect(res.body.error[1]).toEqual('Last name should not be left empty: Please input lastName');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('Should not post form with wrong inputs', async done => {
      server()
        .post(`${url}/authors`)
        .send(author.wrongInputType)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error[0]).toEqual('first Name can only contain letters: Please remove invalid characters');
          expect(res.body.error[1]).toEqual('Last name can ony contain letters: remove invalid characters');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});

describe('Test list authors functionality', () => {
  let tokenAuth;

  beforeAll((done) => {
    server()
    .post(`${url}/auth/signin`)
    .send(mockUser.completeLoginData)
    .end((err, res) => {
      tokenAuth  = res.body.data.token;     
      done();
    })
  });
  it('Should list all authors for an authorised user', async done => {
    server()
    .get(`${url}/authors`)
    .set('Authorization', tokenAuth)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Authors retrieved successfully');
      done();
    });
  });

  // it('Should list all authors for an unauthorised user', async done => {
  //   server()
  //   .get(`${url}/authors`)
  //   .end((err, res) => {
  //     expect(res.statusCode).toEqual(403);
  //     expect(res.body).toHaveProperty('error');
  //     expect(res.body.error).toEqual('Authentication is required');
  //     done();
  //   });
  // });
});
