const mockBook = {
  completeBookData: {
    title: 'Javascript just got easier',
    description: 'Javascript A - Z',
    author: 'Pelumi Aleshinloye Lukmon',
    year: 2019,
    categoryID: 1,
    userID: 1,
  },
  wrongCategoryIDBookData: {
    title: 'Javascript just got easier',
    description: 'Javascript A - Z',
    author: 'Pelumi Aleshinloye Lukmon',
    year: 2019,
    userID: 1,
    categoryID: 90000,
  },
  emptyBookData: {
    title: '',
    description: '',
    author: '',
    userID: 1,
  },
};

export default mockBook;