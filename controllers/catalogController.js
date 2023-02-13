const { hasUser, isGuest } = require("../middlewares/guards");
const {
  getById,
  create,
  getAll,
  deleteById,
  update,
  bookReview,
} = require("../services/catalogService");
const { parseError } = require("../util/parser");
const catalogController = require("express").Router();

catalogController.get("/", async (req, res) => {
  const books = await getAll();
  res.render("catalog", {
    tytle: "Catalog page",
    user: req.user,
    books,
  });
});

catalogController.get("/:id/details", async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner == req.user._id) {
    book.isOwner = true;
  } else if (
    book.bookings.map((b) => b.toString()).includes(req.user._id.toString())
  ) {
    book.isBooked = true;
  }

  res.render("details", {
    title: "Book Details",
    book,
  });
});

catalogController.get("/create", (req, res) => {
  res.render("create", {
    title: "Create new book review",
  });
});

catalogController.get("/:id/edit", hasUser(), async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner != req.user._id) {
    return res.redirect("/auth/404");
  }

  res.render("edit", {
    title: "Edit Book",
    book,
  });
});

catalogController.post("/:id/edit", hasUser(), async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner != req.user._id) {
    return res.redirect("/auth/404");
  }

  const edited = {
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    review: req.body.review,
    genre: req.body.genre,
    stars: Number(req.body.stars),
  };

  try {
    if (Object.values(edited).some((value) => !value)) {
      throw new Error("All fields are required");
    }

    await update(req.params.id, edited);
    res.redirect(`/catalog/${req.params.id}/details`); // To check if this is the right page
  } catch (err) {
    res.render("edit", {
      title: "Edit Book",
      book: Object.assign(edited, { _id: req.params.id }),
      errors: parseError(err),
    });
  }
});

catalogController.post("/create", hasUser(), async (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    review: req.body.review,
    genre: req.body.genre,
    stars: Number(req.body.stars),
    owner: req.user._id,
  };

  try {
    if (Object.values(book).some((value) => !value)) {
      throw new Error("All fields are required");
    }

    await create(book);
    res.redirect("/catalog");
  } catch (err) {
    res.render("create", {
      title: "Create new book review",
      errors: parseError(err),
      body: book,
    });
  }
});

catalogController.get("/:id/delete", hasUser(), async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner != req.user._id) {
    return res.redirect("/auth/404");
  }

  await deleteById(req.params.id);
  res.redirect("/catalog");
});

catalogController.get("/:id/book", hasUser(), async (req, res) => {
  const book = await getById(req.params.id);

  try {
    if (book.owner == req.user._id) {
      book.isOwner = true;
      throw new Error("You can't add your already readed book");
    }

    if (
      book.bookings.map((b) => b.toString()).includes(req.user._id.toString())
    ) {
      book.isBooked = true;
      throw new Error("You already added the book to your wish list");
    }
    await bookReview(req.params.id, req.user._id);
    res.redirect(`/catalog/${req.params.id}/details`);
  } catch (err) {
    res.render("details", {
      title: "Book Details",
      book,
      errors: parseError(err),
    });
  }
});

module.exports = catalogController;
