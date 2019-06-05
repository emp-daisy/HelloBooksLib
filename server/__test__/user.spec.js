import supertest from 'supertest';
import sinon from 'sinon';
import passport from 'passport';
import app from '../index';
import users from './mock_data/user';
import mockUser from './mock_data/mock_users';

const server = () => supertest(app);
const url = '/api/v1';
let token;
let userId;
const passwordToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUB0ZXN0LmNvbSIsImlhdCI6MTU1OTY2MTgwMn0.d_2-msW7YeZ0RtzHhe_7-b3QBmy0IuCJUAeey6SwPhY';
const wrongPasswordToken = 'eyJhbGciOi.eyJpZCI6MSwiZW1haWwiOiJ.rAb7aZJip36siJGnU';


describe('User tests', () => {
  describe('test for user signup', () => {
    it('Should register a user when all required input is supplied', async done => {
      server()
        .post(`${url}/auth/signup`)
        .send(users[0])
        .end((err, res) => {
          token = res.body.data.mailToken;
          userId = res.body.data.id;
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('User Created successfully');
          expect(res.body.status).toEqual(201);
          expect(res.body.data).toHaveProperty('token');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('firstName');
          expect(res.body.data).toHaveProperty('lastName');
          expect(res.body.data).toHaveProperty('email');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
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

    it('Should not register a new user if the user already exists', async done => {
      server()
        .post(`${url}/auth/signup`)
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).toEqual(409);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('email address exists already');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });
  });

  describe('Signin with social media', () => {
    let authenticate;
    beforeEach(() => {
      authenticate = sinon.stub(passport, 'authenticate').returns(() => {});
    });

    afterEach(() => {
      authenticate.restore();
    });
    it('should signup a new user from google', done => {
      authenticate.yields(null, users[1]);
      server()
        .post(`${url}/oauth/google`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Login successful');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('token');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('should signin a new user from google', done => {
      authenticate.yields(null, users[1]);
      server()
        .post(`${url}/oauth/google`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Login successful');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('token');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('should signup a new user from facebook', done => {
      authenticate.yields(null, users[2]);
      server()
        .post(`${url}/oauth/facebook`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Login successful');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('token');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('should signin a new user from facebook', done => {
      authenticate.yields(null, users[2]);
      server()
        .post(`${url}/oauth/facebook`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Login successful');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('token');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('should not signin with google without an access_token', done => {
      authenticate.yields(null, false);
      server()
        .post(`${url}/oauth/google`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('Unauthorized');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('should not signin with facebook without an access_token', done => {
      authenticate.yields(null, false);
      server()
        .post(`${url}/oauth/facebook`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('Unauthorized');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });
  });

  describe('Password reset tests', () => {
    it('Should successfully initiate password reset process if the email exists on our platform', async done => {
      server()
        .post(`${url}/auth/passwordreset`)
        .send({ email: 'john.doe@test.com' })
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('A password reset link has been sent to your email');
          expect(res.body.status).toEqual(200);
          done();
        });
    });

    it('Should not initiate password reset process if email does not exist on our platform', async done => {
      server()
        .post(`${url}/auth/passwordreset`)
        .send({ email: 'jane.doe@test.com' })
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('The email you entered did not match our records. Please double-check and try again.');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('Should verify valid user with a valid password token',  async done => {
      server()
      .get(`${url}/auth/passwordreset/1/${passwordToken}`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not verify for an invalid user id',  async done => {
      server()
      .get(`${url}/auth/passwordreset/5676671/${passwordToken}`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Invalid password reset link'); 
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not verify for an invalid password token',  async done => {
      server()
      .get(`${url}/auth/passwordreset/1/${wrongPasswordToken}`)
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Invalid password reset link'); 
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should reset the password for valid user with valid password token',  async done => {
      server()
      .post(`${url}/auth/resetpassword`)
      .send({id: 1, token: passwordToken, password: 'Password123'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Password reset successfully');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not reset password for invalid user',  async done => {
      server()
      .post(`${url}/auth/resetpassword`)
      .send({id: 5000484, token: passwordToken, password: 'Password123'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Invalid password reset link');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not reset password for user with invalid token',  async done => {
      server()
      .post(`${url}/auth/resetpassword`)
      .send({id: 1, token: wrongPasswordToken, password: 'Password123'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Invalid password reset link');
        done();
        expect(res.body).toMatchSnapshot();
      });
    });

    it('Should not reset password that does not meet validation criteria',  async done => {
      server()
      .post(`${url}/auth/resetpassword`)
      .send({id: 1, token: passwordToken, password: 'pass'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error[0])
          .toEqual('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit');
        expect(res.body.error[1]).toEqual('Password Length should be at least 8 Characters');
        done();
      });
    });
  });

  describe('test for email signin', () => {
    it('Should sign in a user with complete form data', async done => {
      server()
        .post(`${url}/auth/signin`)
        .send(mockUser.completeLoginData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Login successful');
          expect(res.body.status).toEqual(200);
          expect(res.body.data).toHaveProperty('token');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('firstName');
          expect(res.body.data).toHaveProperty('lastName');
          expect(res.body.data).toHaveProperty('email');
          done();
          expect(Object.keys(res.body.data)).toMatchSnapshot();
        });
    });

    it('Should not sign in with incomplete form data', async done => {
      server()
        .post(`${url}/auth/signin`)
        .send(mockUser.incompleteLoginData)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error[0]).toEqual('Email should not be left empty: Please input email address');
          expect(res.body.error[1]).toEqual('Password should not be empty: Please input password');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('Should not sign in user with wrong email', async done => {
      server()
        .post(`${url}/auth/signin`)
        .send(mockUser.wrongEmail)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error[0]).toEqual('Email is not valid: Please input a valid email address');          
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('Should not sign in an unkown user', async done => {
      server()
        .post(`${url}/auth/signin`)
        .send(mockUser.unknownUser)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('Incorrect Login information');          
          done();
          expect(res.body).toMatchSnapshot();
        });
    });

    it('Should not sign in user with incorrect password', async done => {
      server()
        .post(`${url}/auth/signin`)
        .send(mockUser.incorrectPassword)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual('Incorrect Login information');
          done();
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});

describe('test for verifying email', () => {
  it('Should send a 200 response if user token and id is valid',  async done => {
    server()
    .get(`${url}/auth/verifyemail?token=${token}&id=${userId}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Email verified successfully');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });
  it('Should fail if token doesn\'t match the user email_confirm_code token', async done => {
     server()
    .get(`${url}/auth/verifyemail?token=${token.substring(2, 30)}&id=${userId}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid verification link');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });
   it('Should fail if user id is invalid', async done => {
     server()
    .get(`${url}/auth/verifyemail?token=${token}&id=${994444}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid verification link');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });
     it('Should fail if user id and token are not defined', async done => {
     server()
    .get(`${url}/auth/verifyemail`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('token and id must be defined');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });
      it('Should fail if user id is not defined', async done => {
     server()
    .get(`${url}/auth/verifyemail?token=${token}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('id must be defined');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });
      it('Should fail if user token is not defined', async done => {
     server()
    .get(`${url}/auth/verifyemail?id=${userId}`)
    .end((err, res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('token must be defined');
      done();
      expect(res.body).toMatchSnapshot();
    })
  });

  describe('test super admin role assigning', () => {
    it('Should pass and return 200 response if role was successfully assigned', async done => {
      server()
      .post(`${url}/auth/assignrole?id=${2}`)
      .send({email: 'john.doe@test.com', role: 'admin'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Role Assigned successfully');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
    it('Should fail and return 401 response if user id is not found in db', async done => {
      server()
      .post(`${url}/auth/assignrole?id=${678}`)
      .send({email: 'john.doe@test.com', role: 'admin'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
         expect(res.body.error).toEqual('Not Authorized');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
    it('Should fail and return 404 response if user email is not found', async done => {
      server()
      .post(`${url}/auth/assignrole?id=${2}`)
      .send({email: 'jane.doe@test.com', role: 'admin'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
         expect(res.body.error).toEqual('User does not exists');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
     it('Should fail and return 401 response if there is no id in the query', async done => {
      server()
      .post(`${url}/auth/assignrole`)
      .send({email: 'john.doe@test.com', role: 'admin'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Not Authorized');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
    it('Should fail and return 400 response if email is missing from request body ', async done => {
      server()
      .post(`${url}/auth/assignrole?id=${2}`)
      .send({email: '', role: 'admin'})
      .end((err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
    it('Should fail and return 400 response if role is missing from request body ', async done => {
      server()
      .post(`${url}/auth/assignrole?id=${2}`)
      .send({email: 'john.doe@test.com', role: ''})
      .end((err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        done();
        expect(res.body).toMatchSnapshot();
      })
    });
  })
})
