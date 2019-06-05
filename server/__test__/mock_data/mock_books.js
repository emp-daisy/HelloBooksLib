const mockBook = {
  completeBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    amount: 3451,
    status: true,
    year: 2019,
    authorID: 2
  },
  emptyBookData: {
    title: '',
    description: '',
    amount: '',
    status: true,
    year: ''
  },
  unsupportedBookData: {
    title: 'Coding with one eye',
    description: 'This book teaches you how to code without really knowing what you are doing',
    amount: 'money',
    status: 'wrong status',
    year: 'babab'
  },
};

export default mockBook;
