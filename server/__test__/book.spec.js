import supertest from 'supertest';
import app from '../index';
import mockBook from './mock_data/mock_books';

const server = () => supertest(app);
const url = '/api/v1';

describe('Books tests', () => {
  describe('test for add books', () => {
    it('Should add a new book when all required input is supplied', async done => {
      server()
        .post(`${url}/books`)
        .send(mockBook.completeBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('Book added successfully');
          expect(res.body.status).toEqual(201);
          expect(res.body.data).toHaveProperty('year');
          expect(res.body.data).toHaveProperty('title');
          expect(res.body.data).toHaveProperty('amount');
          expect(res.body.data).toHaveProperty('status');
          expect(res.body.data).toHaveProperty('description');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });
    it('Should throw an error when inputs are not supplied', async done => {
      server()
        .post(`${url}/books`)
        .send(mockBook.emptyBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[0]).toEqual(
            'Title can not be left empty: Please input title'
          );
          expect(res.body.error[1]).toEqual(
            'Description can not be left empty: Please input description'
          );
          expect(res.body.error[2]).toEqual(
            'Amount can not be left empty: Please input amount'
          );
          expect(res.body.error[3]).toEqual(
            'AuthorID can not be left empty: Please input amount'
          );
          done();
        });
    });
    it('Should throw an error when inputs are not supported', async done => {
      server()
        .post(`${url}/books`)
        .send(mockBook.unsupportedBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[0]).toEqual(
            'Amount is not valid currency: Please input a valid amount'
          );
          expect(res.body.error[1]).toEqual(
            'AuthorID can not be left empty: Please input amount'
          );
          expect(res.body.error[2]).toEqual(
            'Year is not valid year: Please input a valid year'
          );
          done();
        });
    });
    it('Should throw an error when authorID does not exist in the database', async (done) => {
      server()
        .post(`${url}/books`)
        .send(mockBook.wrongAuthorIDBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[0]).toEqual('No author with the specified ID was found');
          done();
        });
    });
  });
});

describe('GET Books tests', () => {
  it('should get all books in the database', done => {
    server()
      .get(`${url}/books`)
      .end((err, res) => {
        const { data } = res.body;
        const response = data[0];
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('success');
        expect(res.body.status).toEqual(200);
        expect(response).toHaveProperty('year');
        expect(response).toHaveProperty('title');
        expect(response).toHaveProperty('amount');
        expect(response).toHaveProperty('status');
        expect(response).toHaveProperty('description');
        done();
      });
  });

    it('should paginate book listing', done => {
      const page = 1;
      const limit = 10;
      server()
        .get(`${url}/books?page=${page}&limit=${limit}`)
        .end((err, res) => {
          const { data } = res.body;
          const response = data[0];
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('pages');
          expect(response).toHaveProperty('year');
          expect(response).toHaveProperty('title');
          expect(response).toHaveProperty('amount');
          expect(response).toHaveProperty('status');
          expect(response).toHaveProperty('description');
          done();
        });
    });

    it('should use fallback for paginating listing with invalid page number', done => {
      const page = 'page';
      const limit = 'limit';
      server()
        .get(`${url}/books?page=${page}&limit=${limit}`)
        .end((err, res) => {
          const { data } = res.body;
          const response = data[0];
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('pages');
          expect(response).toHaveProperty('year');
          expect(response).toHaveProperty('title');
          expect(response).toHaveProperty('amount');
          expect(response).toHaveProperty('status');
          expect(response).toHaveProperty('description');
          done();
        });
    });
});