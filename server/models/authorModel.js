/* eslint-disable require-jsdoc */
class Author {
  constructor(author) {
    this.authorId = author.id;
    this.firstName = author.firstName;
    this.middleName = author.middleName ? author.middleName : undefined;
    this.lastName = author.lastName;
  }
}
export default Author;
