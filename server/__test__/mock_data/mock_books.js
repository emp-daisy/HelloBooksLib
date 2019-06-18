const mockBook = {
  completeBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    tags: 'Coding',
    amount: 3451,
    status: 'Available',
    year: 2019,
    authorID: 1,
    isbn: 1234354678,
    categoryID: 1
  },
  wrongAuthorIDBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    tags: 'Coding',
    amount: 3451,
    status: 'Available',
    year: 2019,
    authorID: 98
  },
  wrongCategoryIDBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    tags: 'Coding',
    amount: 3451,
    status: 'Available',
    year: 2019,
    authorID: 1,
    isbn: '',
    categoryID: 90000,
  },
  emptyBookData: {
    title: '',
    description: '',
    tags: '',
    amount: '',
    status: 'Available',
    year: ''
  },
  unsupportedBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    tags: 'Coding',
    amount: 'money',
    active: 'wrong status',
    year: 'babab'
  },
};

export default mockBook;
