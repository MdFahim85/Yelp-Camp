const User = require("../models/user.model");

module.exports.getRegister = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body.user;
    const user = new User({
      email,
      username,
      image: { url: req.file.path, fileName: req.file.fileName },
    });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Registration Complete, Welcome to Yelpcamp ${username}`
      );
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.userLogin = (req, res) => {
  const { username } = req.user;
  req.flash("success", `Welcome Back ${username}`);
  res.redirect("/campgrounds");
};

module.exports.userLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully");
    res.redirect("/campgrounds");
  });
};
