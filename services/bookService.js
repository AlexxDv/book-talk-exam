const Book = require("../models/Book");

async function getAll() {
  return await Book.find({}).lean(); // При подаване на празен обект, това означава -> намери ги всичките
}

async function create(book) {
  return await Book.create(book);
}

module.exports = {
  getAll,
  create,
};
