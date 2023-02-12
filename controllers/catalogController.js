const catalogController = require("express").Router();

catalogController.get("/", (req, res) => {
  res.render("catalog", {
    tytle: "Catalog page",
    user: req.user,
  });
});


module.exports = catalogController