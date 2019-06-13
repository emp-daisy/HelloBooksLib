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
  updateUserProfile: {
    bio: 'I love to swim',
    profilePic: 'catchemyoung.jpg',
    favoriteQuote: 'I believe I can fly', 
    favoriteBooks: ['YDKJS'], 
    username: 'updatedusername'
  }
}

export default mockUser;