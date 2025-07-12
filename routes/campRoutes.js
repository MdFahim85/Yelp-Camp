const express = require("express");
const router = express.Router();
const wrapper = require("../utils/wrapper");
const { isLoggedIn, isAuthor, validateCamp } = require("../utils/middleware");
const {
  showAll,
  getNew,
  createNew,
  showOne,
  getOne,
  editOne,
  deleteOne,
} = require("../controllers/campController");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapper(showAll))
  .post(isLoggedIn, upload.array("image"), validateCamp, wrapper(createNew));

router.get("/new", isLoggedIn, getNew);

router
  .route("/:id")
  .get(wrapper(showOne))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCamp,
    wrapper(editOne)
  )
  .delete(isLoggedIn, isAuthor, wrapper(deleteOne));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapper(getOne));

module.exports = router;
