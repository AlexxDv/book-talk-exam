const Book = require("../models/Book");

async function getAll() {
  return await Book.find({}).lean(); // При подаване на празен обект, това означава -> намери ги всичките
}

async function getById(id) {
  return Book.findById(id).lean();
}

async function getByUserBooking(userId) {
  return Book.findById({ bookings: userId }).lean();
}

async function create(book) {
  return await Book.create(book);
}

async function update(id, book) {
  const existing = await Book.findById(id);

  existing.title = book.title;
  existing.author = book.author;
  existing.genre = book.genre;
  existing.stars = book.stars;
  existing.imageUrl = book.imageUrl;
  existing.review = book.review;

  await existing.save();
}

async function deleteById(id) {
  await Book.findByIdAndRemove(id);
}

async function bookReview(bookId, userId) {
  const book = await Book.findById(bookId);

  book.bookings.push(userId);
  await book.save();
}



module.exports = {
  getAll,
  getById,
  getByUserBooking,
  update,
  create,
  deleteById,
  bookReview,
};
