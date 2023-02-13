const { hasUser } = require("../middlewares/guards");
const { getByUserBooking } = require("../services/catalogService");
const profileController = require("express").Router();



profileController.get("/", hasUser(), async (req, res) => {
    const wish = await getByUserBooking(req.user._id);
  
    res.render("profile", {
      title: "Profile Page",
      user: Object.assign({ wish }, req.user),
    });
  });
  
  module.exports = profileController;