const mockUser = {
  completeLoginData: {
    email: 'testing1@example.com',
    password: 'password'
  },

  incompleteLoginData: {
    email: '',
    password: ''
  },

  wrongEmail: {
    email: 'wrongEmail@wrong.com',
    password: 'password'
  },

  incorrectPassword: {
    email: 'testing1@example.com',
    password: 'randomword'
  },
}

export default mockUser;
