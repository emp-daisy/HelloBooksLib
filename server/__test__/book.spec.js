import supertest from 'supertest';
import app from '../index';
import mockBook from './mock_data/mock_books';
import mockReqBook from './mock_data/mock_requested_books';

const server = () => supertest(app);
const url = '/api/v1/books';

describe('Books tests', () => {
  describe('test for add books', () => {
    it('Should add a new book when all required input is supplied', async done => {
      server()
        .post(`${url}`)
        .send(mockBook.completeBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('Book added successfully');
          expect(res.body.status).toEqual(201);
          expect(res.body.data).toHaveProperty('year');
          expect(res.body.data).toHaveProperty('title');
          expect(res.body.data).toHaveProperty('amount');
          expect(res.body.data).toHaveProperty('active');
          expect(res.body.data).toHaveProperty('description');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });
    it('Should throw an error when inputs are not supplied', async done => {
      server()
        .post(`${url}`)
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
            'ISBN can not be left empty: Please input isbn'
          );
          expect(res.body.error[4]).toEqual(
            'AuthorID can not be left empty: Please input authorID'
          );
          expect(res.body.error[5]).toEqual(
            'CategoryID can not be left empty: Please input categoryID'
          );
          expect(res.body.error[6]).toEqual(
            'Year can not be left empty: Please input amount'
          );
          done();
        });
    });
    it('Should throw an error when inputs are not supported', async done => {
      server()
        .post(`${url}`)
        .send(mockBook.unsupportedBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[0]).toEqual('Amount is not valid currency: Please input a valid amount');
          expect(res.body.error[1]).toEqual('ISBN can not be left empty: Please input isbn');
          expect(res.body.error[2]).toEqual('AuthorID can not be left empty: Please input authorID');
          expect(res.body.error[3]).toEqual('CategoryID can not be left empty: Please input categoryID');
          expect(res.body.error[4]).toEqual('Year is not valid year: Please input a valid year');
          done();
        });
    });
    it('Should throw an error when authorID does not exist in the database', async (done) => {
      server()
        .post(`${url}`)
        .send(mockBook.wrongAuthorIDBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[1]).toEqual('No author with the specified ID was found');
          done();
        });
    });
    it('Should throw an error when categoryID does not exist in the database', async (done) => {
      server()
        .post(`${url}`)
        .send(mockBook.wrongCategoryIDBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.status).toEqual(400);
          expect(res.body.error[1]).toEqual('No Category with the specified ID was found');
          done();
        });
    });
  });
  
  describe('Get all books', () => {
    it('Should fetch all books successfully', async (done) => {
      server()
        .get(`${url}`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Books fetched successfully');
          expect(res.body.status).toEqual(200);
          expect(res.body.data[0]).toHaveProperty('year');
          expect(res.body.data[0]).toHaveProperty('title');
          expect(res.body.data[0]).toHaveProperty('amount');
          expect(res.body.data[0]).toHaveProperty('active');
          expect(res.body.data[0]).toHaveProperty('description');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('should paginate book listing', done => {
      const page = 1;
      const limit = 10;
      server()
        .get(`${url}?page=${page}&limit=${limit}`)
        .end((err, res) => {
          const { data } = res.body;
          const response = data[0];
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('pages');
          expect(response).toHaveProperty('year');
          expect(response).toHaveProperty('title');
          expect(response).toHaveProperty('amount');
          expect(response).toHaveProperty('active');
          expect(response).toHaveProperty('description');
          done();
        });
    });

    it('should use fallback for paginating listing with invalid page number', done => {
      const page = 'page';
      const limit = 'limit';
      server()
        .get(`${url}?page=${page}&limit=${limit}`)
        .end((err, res) => {
          const { data } = res.body;
          const response = data[0];
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('pages');
          expect(response).toHaveProperty('year');
          expect(response).toHaveProperty('title');
          expect(response).toHaveProperty('amount');
          expect(response).toHaveProperty('active');
          expect(response).toHaveProperty('description');
          done();
        });
    });
  });
  
  describe('Get specific book', () => {
    it('Should fetch a specific book successfully', async (done) => {
      server()
        .get(`${url}/1`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Book fetched successfully');
          expect(res.body.status).toEqual(200);
          expect(res.body.data).toHaveProperty('year');
          expect(res.body.data).toHaveProperty('title');
          expect(res.body.data).toHaveProperty('amount');
          expect(res.body.data).toHaveProperty('active');
          expect(res.body.data).toHaveProperty('description');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('Should return an error message when a non existing book ID is specified', async (done) => {
      server()
        .get(`${url}/510`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body.error).toEqual('Book with the specified ID not found');
          expect(res.body.status).toEqual(404);
          done();
        });
    });

    it('Should return an error message when a non integer book ID is specified', async (done) => {
      server()
        .get(`${url}/q`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error[0]).toEqual('ID must be a number greater than 1');
          expect(res.body.status).toEqual(400);
          done();
        });
    });
  });

  describe('Delete specific book', () => {
    it('Should delete a specific book successfully', async (done) => {
      server()
        .delete(`${url}/1`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Book deleted successfully');
          expect(res.body.status).toEqual(200);
          done();
        });
    });

    it('Should return an error message when a non existing book ID is specified', async (done) => {
      server()
        .delete(`${url}/510`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body.error).toEqual('Book with the specified ID not found');
          expect(res.body.status).toEqual(404);
          done();
        });
    });

    it('Should return an error message when a non integer book ID is specified', async (done) => {
      server()
        .delete(`${url}/q`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error[0]).toEqual('ID must be a number greater than 1');
          expect(res.body.status).toEqual(400);
          done();
        });
    });
  });

  describe('Request a new Book', () => {
    it('Should succesfully make a request if all input are supplied', async (done) => {
      server()
        .post(`${url}/request`)
        .send(mockReqBook.completeBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('Book requested successfully');
          expect(res.body.status).toEqual(201);
          expect(res.body.data).toHaveProperty('title');
          expect(res.body.data).toHaveProperty('description');
          expect(res.body.data).toHaveProperty('author');
          expect(res.body.data).toHaveProperty('year');
          expect(res.body.data).toHaveProperty('categoryID');
          done();
        })
    })
    it('Should throw an error when Category does not exist in database', (done) => {
      server()
        .post(`${url}/request`)
        .send(mockReqBook.wrongCategoryIDBookData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error[0]).toEqual('No Category with the specified ID was found');
          expect(res.body.status).toEqual(400);
          done();
        })
    });
    it('Should throw an error when inputs are not supplied', (done) => {
      server()
        .post(`${url}/request`)
        .send(mockReqBook.emptyBookData)
        .end((err, res) => {
          expect(res.body.error[0]).toEqual(
            'Title can not be left empty: Please input title'
          );
          expect(res.body.error[1]).toEqual(
            'Description can not be left empty: Please input description'
          );
          expect(res.body.error[2]).toEqual(
            'Author can not be left empty: Please input author'
          );
          expect(res.body.error[3]).toEqual(
            'CategoryID can not be left empty: Please input categoryID'
          );
          expect(res.body.error[4]).toEqual(
            'Year can not be left empty: Please input amount'
          );
          done();
        })
    });
  });
});
