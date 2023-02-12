const Book = require("../models/Book");








async function create(book) {
    return await Book.create(book)
}

module.exports = {
    create
}