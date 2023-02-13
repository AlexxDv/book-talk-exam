const {Schema, model, Types} = require('mongoose');

const URL_PATTERN = /^https?:\/\/.+$/i;

const bookSchema = new Schema({
    title: {type: String, required: true, minLength: [2, "Title length must be at least 2 characters long"]}, 
    author: {type: String, required: true, minLength: [5, "Title length must be at least 5 characters long"]},
    imageUrl: {type: String, required: true, validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: 'Please enter a valid url'
    }},
    review: {type: String, required: true, minLength: [10, "Review length must be at least 10 characters long"]},
    genre: {type: String, required: true},
    stars: {type: Number, required: true, validate: {
        validator: function(value) {
          return value >= 1 && value <= 5;
        },
        message: 'Stars must be between 1 and 5.'
      }},
      bookings: { type: [Types.ObjectId], ref: "User", default: []},
    owner: {type: Types.ObjectId, ref: "User", required: true},
})

const Book = model('Book', bookSchema);

module.exports = Book;