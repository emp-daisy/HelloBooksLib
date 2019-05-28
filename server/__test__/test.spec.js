import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

const server = () => chai.request(app);

describe('Welcome to helo books', () => {
  it('Should return a message on app start', (done) => {
    server().get('/')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('This is Hello books');
      done();
    });
  });
});