const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model");

const campGroundSchema = new Schema({
  title: String,
  image: [{ url: String, fileName: String }],
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

campGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campGroundSchema);
