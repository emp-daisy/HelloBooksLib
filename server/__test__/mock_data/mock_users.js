const mockUser = {
  completeLoginData: {
    email: 'testing1@example.com',
    password: 'PassWord123..'
  },

  incompleteLoginData: {
    email: '',
    password: ''
  },

  wrongEmail: {
    email: 'wrongEmail@com',
    password: 'PassWord123..'
  },

  unknownUser: {
    email: 'unknown_person@gmail.com',
    password: 'PassWord123..'
  },

  incorrectPassword: {
    email: 'testing1@example.com',
    password: 'randomword'
  },
}

export default mockUser;