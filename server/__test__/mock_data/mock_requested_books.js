const mockBook = {
  completeBookData: {
    title: 'Javascript just got easier',
    description: 'Javascript A - Z',
    tags: 'Javascript',
    author: 'Pelumi Aleshinloye Lukmon',
    year: 2019,
    categoryID: 1,
    userID: 2,
  },
  wrongCategoryIDBookData: {
    title: 'Javascript just got easier',
    description: 'Javascript A - Z',
    tags: 'Javascript',
    author: 'Pelumi Aleshinloye Lukmon',
    year: 2019,
    userID: 2,
    categoryID: 90000,
  },
  emptyBookData: {
    title: '',
    description: '',
    tags: '',
    author: '',
    userID: 2,
  },
};

export default mockBook;