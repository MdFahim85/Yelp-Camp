const Campground = require("../models/campground.model");
const expressError = require("./expressError");
const { campgroundSchema } = require("../schemas");
const { reviewSchema } = require("../schemas");
const Review = require("../models/review.model");
// Login Middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

// Author Middleware

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You dont have the permission to access this");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You dont have the permission to access this");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Validaton Middleware

module.exports.validateCamp = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new expressError(message, 404);
  } else {
    next();
  }
};

// Review Validation Middleware

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new expressError(message, 404);
  } else {
    next();
  }
};
