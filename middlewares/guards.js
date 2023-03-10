function hasUser() {
  return (req, res, next) => {
    if (req.user) {
      //да изпробвам дали ще стане с за проверка на view details при guest login
      //req.user = {}
      next();
    } else {
      res.redirect("/auth/404");
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    if (req.user) {
      res.redirect("/"); //TODO check the assignment for correct redirect path
    } else {
      next();
    }
  };
}

module.exports = {
  hasUser,
  isGuest,
};
