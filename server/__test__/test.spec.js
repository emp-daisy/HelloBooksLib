// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import app from '../index';

const server = () => supertest(app);
const url = '/api/v1';

describe('Welcome to helo books', () => {
  it('Should return a message on app start', done => {
    server()
      .get(`${url}/`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('This is Hello books');
        done();
        expect(res.body).toMatchSnapshot();
      });
  });

  it('Should return an error message for an invalid URL', done => {
    server()
      .get(`${url}/unknown`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual(
          'Sorry, the requested endpoint does not exist on our server'
        );
        done();
        expect(res.body).toMatchSnapshot();
      });
  });

  it('Should redirect to /api/v1', done => {
    server()
      .get(`/`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(302);
        done();
        expect(res.body).toMatchSnapshot();
      });
  });
});
