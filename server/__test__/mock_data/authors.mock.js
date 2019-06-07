const author = {
  validInputs: {
    firstName: 'Kelvin',
    middleName: 'James',
    lastName: 'Rockson'
  },

  incompleteData: {
    firstName: '',
    middleName: 'Mike',
    lastName: ''
  },

  wrongInputType: {
    firstName: 'John John',
    middleName: '*',
    lastName: '---???'
  },

  updateAuthor1: {
    firstName: 'Kelvin',
    middleName: 'Nick',
    lastName: 'Simon'
  },

  invalidUpdate: {
    firstName: 'Kelvin',
    middleName: '419',
    lastName: 'Simon'
  },
}

export default author;