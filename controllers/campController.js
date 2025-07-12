const Campground = require("../models/campground.model");
const { cloudinary } = require("../cloudinary");

module.exports.showAll = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("./campgrounds/index", { campgrounds });
};

module.exports.getNew = (req, res) => {
  res.render("./campgrounds/new");
};

module.exports.createNew = async (req, res) => {
  const camp = new Campground(req.body.campground);
  camp.image = req.files.map((file) => ({
    url: file.path,
    fileName: file.filename,
  }));
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Campground has been created successfully");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showOne = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Can not find the campground you are looking for");
    return res.redirect("/campgrounds");
  }
  res.render("./campgrounds/show", { campground });
};

module.exports.getOne = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Can not find the campground you are looking for");
    return res.redirect("/campgrounds");
  }
  res.render("./campgrounds/edit", { camp });
};

module.exports.editOne = async (req, res) => {
  const { id } = req.params;
  const updatedCamp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const img = req.files.map((file) => ({
    url: file.path,
    fileName: file.filename,
  }));
  updatedCamp.image.push(...img);
  updatedCamp.save();
  if (req.body.deletedImages) {
    for (let fileName of req.body.deletedImages) {
      await cloudinary.uploader.destroy(fileName);
    }
    await updatedCamp.updateOne({
      $pull: { image: { fileName: { $in: req.body.deletedImages } } },
    });
  }
  req.flash("success", "Campground has been updated successfully");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteOne = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  for (let image of camp.image) {
    try {
      await cloudinary.uploader.destroy(image.fileName);
    } catch (err) {
      console.error(`Failed to delete image ${image.fileName}:`, err);
    }
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground has been deleted successfully");
  res.redirect("/campgrounds");
};
