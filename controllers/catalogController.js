const { create } = require("../services/bookService");
const { parseError } = require("../util/parser");
const catalogController = require("express").Router();

catalogController.get("/", (req, res) => {
  res.render("catalog", {
    tytle: "Catalog page",
    user: req.user,
  });
});

catalogController.get("/create", (req, res) => {
  res.render("create", {
    title: "Create new book review",
  });
});


catalogController.post("/create", async (req, res) => {
const book = {
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    review: req.body.review,
    genre: req.body.genre,
    stars: Number(req.body.stars),
    owner: req.user._id,

}

try {
    if (Object.values(book).some((value) => !value)) {
      throw new Error("All fields are required");
    }

    await create(book);
    res.redirect("/");
  } catch (err) {
    res.render("create", {
      title: "Create new book review",
      body: book,
      errors: parseError(err),
    });
  }

})

module.exports = catalogController;
