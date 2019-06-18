import supertest from 'supertest';
import app from '../index';
import mockBook from './mock_data/mock_books';
import mockReqBook from './mock_data/mock_requested_books';

const server = () => supertest(app);
const url = '/api/v1/books';

let token ;
let adminToken;


describe('Books tests', () => {
  describe('test for add books', () => {
    it('Should add a new book when all required input is supplied', async done => {
      server()
        .post(`${url}`)
        .send(mockBook.completeBookData)
        .end((_err, res) => {
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
        .post(`${url}`)
        .send(mockBook.emptyBookData)
        .end((_err, res) => {
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
        .end((_err, res) => {
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
        .end((_err, res) => {
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
        .end((_err, res) => {
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
        .end((_err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Books fetched successfully');
          expect(res.body.status).toEqual(200);
          expect(res.body.data[0]).toHaveProperty('year');
          expect(res.body.data[0]).toHaveProperty('title');
          expect(res.body.data[0]).toHaveProperty('amount');
          expect(res.body.data[0]).toHaveProperty('status');
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
        .end((_err, res) => {
          const { searchResult } = res.body;
          const response = searchResult[0];
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
        .get(`${url}?page=${page}&limit=${limit}`)
        .end((_err, res) => {
          const { searchResult } = res.body;
          const response = searchResult[0];
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

    it('should list available books if search parameter matches any title, description, tags and/or author', done => {
      const searchBook = 'Practical';
      server()
        .get(`${url}?searchBook=${searchBook}`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.searchResult[0]).toHaveProperty('year');
          expect(res.body.searchResult[0]).toHaveProperty('tags');
          expect(res.body.searchResult[0]).toHaveProperty('title');
          expect(res.body.searchResult[0]).toHaveProperty('amount');
          expect(res.body.searchResult[0]).toHaveProperty('status');
          expect(res.body.searchResult[0]).toHaveProperty('description');
          expect(res.body.searchResult[0]).toHaveProperty('Author');
          done();
        });
    });

    it('should give error if search parameter does not matches any title, description and/or tag', done => {
      const searchBook = 'something';
      server()
        .get(`${url}?searchBook=${searchBook}`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('No record found');
          done();
        });
    });
  });
  
  describe('Get specific book', () => {
    it('Should fetch a specific book successfully', async (done) => {
      server()
        .get(`${url}/1`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Book fetched successfully');
          expect(res.body.status).toEqual(200);
          expect(res.body.data).toHaveProperty('year');
          expect(res.body.data).toHaveProperty('title');
          expect(res.body.data).toHaveProperty('amount');
          expect(res.body.data).toHaveProperty('status');
          expect(res.body.data).toHaveProperty('description');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('Should return an error message when a non existing book ID is specified', async (done) => {
      server()
        .get(`${url}/510`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body.error).toEqual('Book with the specified ID not found');
          expect(res.body.status).toEqual(404);
          done();
        });
    });

    it('Should return an error message when a non integer book ID is specified', async (done) => {
      server()
        .get(`${url}/q`)
        .end((_err, res) => {
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
        .delete(`${url}/2`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Book deleted successfully');
          expect(res.body.status).toEqual(200);
          done();
        });
    });

    it('Should return an error message when a non existing book ID is specified', async (done) => {
      server()
        .delete(`${url}/510`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body.error).toEqual('Book with the specified ID not found');
          expect(res.body.status).toEqual(404);
          done();
        });
    });

    it('Should return an error message when a non integer book ID is specified', async (done) => {
      server()
        .delete(`${url}/q`)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error[0]).toEqual('ID must be a number greater than 1');
          expect(res.body.status).toEqual(400);
          done();
        });
    });
  });

  describe('Request a new Book', () => {
    beforeAll((done) => {
      server()
    .post('/api/v1/auth/signup')
    .send({
      firstName: 'Test',
      lastName: 'Testing',
      email: 'testing10@example.com',
      password: 'PassWord123..'
    })
    // eslint-disable-next-line no-unused-vars
    .end((_regErr, _regRes) => {
      server()
      .post('/api/v1/auth/signin')
      .send({
        email: 'testing10@example.com',
        password: 'PassWord123..'
      })
      .end((_err, res) => {
        expect(res.body.data).toHaveProperty('token')
       // eslint-disable-next-line prefer-destructuring
        token = res.body.data.token;
        done();
        })
      })
    });
    it('Should succesfully make a request if all input are supplied', async (done) => {
      server()
        .post(`${url}/request`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBook.completeBookData)
        .end((_err, res) => {
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
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBook.wrongCategoryIDBookData)
        .end((_err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error[0]).toEqual('No Category with the specified ID was found');
          expect(res.body.status).toEqual(400);
          done();
        })
    });
    it('Should throw an error when inputs are not supplied', (done) => {
      server()
        .post(`${url}/request`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBook.emptyBookData)
        .end((_err, res) => {
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

  describe('Borrow a book', () => {
    beforeAll((done) => {
      server()
      .post(`/api/v1/auth/signin`)
      .send({
        email: 'admin@test.com',
        password: 'PassWord123..'
      })
      .end((err, res) => {
        adminToken  = res.body.data.token;
        done();
      })
    })

    it('Should lend a book', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 4,
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.message).toEqual('Success');
        done();
      });
    });

    it('Should not borrow out a book if it has already been borrowed', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        title: 'Book Title',
        patronId: 4
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
      });
    });

    it('Should not lend a book if the patron has fines to pay', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        title: 'Book Title',
        patronId: 5
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
      });
    });

    it('Should return error if form data is incorrect', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: 'dfd ',
        patronId: 5
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('ISBN is not valid integer: Please input a valid ISBN');
        done();
      });
    });

    it('Should return an error is the book is not in the db', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '11111111',
        patronId: 5
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('No Book with the specified isbn was found');
        done();
      });
    });

    it('Should return error if the user is not in the db', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1034574',
        patronId: 2000
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('No User with the specified patronID was found');
        done();
      });
    });

    it('Should return unauthorized if user is not an admin', async done => {
      server()
      .post(`${url}/borrow`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isbn: 343434,
        patronId: 30
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Forbidden, You Are not allowed to perform this action');
        done();
      });
    });
  });

  describe('Recieve a book from a patron', () => {
    it('Should recieve a book from a patron', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 4,
        damaged: 'false'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Book successfully returned');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not recieve a book if the book has been damaged', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 4,
        damaged: 'true'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You made damages to our book incuring a cost of 100');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not recieve a book if the due date is passed and assign a fine', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1034564',
        patronId: 3,
        damaged: 'false'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not recieve a book if the due date is passed and is also damaged while assiging a fine', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1034564',
        patronId: 3,
        damaged: 'true'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should return an error for an entry not in the table', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 3,
        damaged: 'true'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Book was not found');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should return an error a user not in the db', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 2000,
        damaged: 'true'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('No User with the specified patronID was found');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should return an error an isbn not in the db', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '11111111',
        patronId: 5,
        damaged: 'true'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('No Book with the specified isbn was found');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should return an error an invalid param', async done => {
      server()
      .post(`${url}/recieve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isbn: '1234354678',
        patronId: 2,
        damaged: 'truez'
      })
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('Should be true or false');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });
  });

  describe('Extend due date', () => {
    let lenderToken;

    beforeAll((done) => {
      server()
      .post(`/api/v1/auth/signin`)
      .send({
        email: 'extender@test.com',
        password: 'PassWord123..'
      })
      .end((err, res) => {
        lenderToken  = res.body.data.token;
        done();
      })
    })

    it('Should extend the due date if a valid details are provided', async done => {
      server()
      .patch(`${url}/extend/5`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: '01/01/2020'})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Due date extended successfully');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('dueDate');
        done();
      });
    });

    it('Should not extend the due date if invalid date is provided', async done => {
      server()
      .patch(`${url}/extend/5`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: '231/01/2020'})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('Please provide a valid date. Format: (MM/DD/YYYY)');
        done();
      });
    });

    it('Should not extend the due date if no date is provided', async done => {
      server()
      .patch(`${url}/extend/5`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: ''})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0]).toEqual('Date cannot be empty');
        done();
      });
    });

    it('Should not extend the due date for a book not borrowed by logged in patron', async done => {
      const id = 3;
      server()
      .patch(`${url}/extend/${id}`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: '01/01/2020'})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual(`You do not have any book with id: ${id} in your possession`);
        done();
      });
    });

    it('Should not extend the due date for a book that is due for return', async done => {
      server()
      .patch(`${url}/extend/4`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: '01/01/2020'})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You cannot extend the borrowing period when the book is overdue. Kindly return the book to the library');
        done();
      });
    });

    it('Should ensure new date is after and not before the previous due date', async done => {
      server()
      .patch(`${url}/extend/5`)
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({ date: '09/09/2019'})
      .end((_err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('The new date must be a date later than the previous due date');
        done();
      });
    });
  });
});
