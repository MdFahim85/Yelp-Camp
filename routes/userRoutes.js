const express = require("express");
const router = express.Router();
const wrapper = require("../utils/wrapper");
const passport = require("passport");
const { isLoggedIn } = require("../utils/middleware");
const {
  getRegister,
  createUser,
  getLogin,
  userLogin,
  userLogout,
} = require("../controllers/userController");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/register")
  .get(getRegister)
  .post(upload.single("image"), wrapper(createUser));

router
  .route("/login")
  .get(getLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userLogin
  );

router.get("/logout", isLoggedIn, userLogout);

module.exports = router;
