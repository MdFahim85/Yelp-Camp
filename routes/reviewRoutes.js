const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapper = require("../utils/wrapper");
const Review = require("../models/review.model");
const Campground = require("../models/campground.model");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middleware");
const { postReview, deleteReview } = require("../controllers/reviewController");

router.post("/", isLoggedIn, validateReview, wrapper(postReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapper(deleteReview));

module.exports = router;
