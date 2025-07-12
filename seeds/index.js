const mongoose = require("mongoose");
const { title } = require("process");
const Campground = require("../models/campground.model");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
mongoose.connect("mongodb://127.0.0.1:27017/Yelp-Camp");

const connectDB = mongoose.connection;
connectDB.on("error", console.error.bind(console, "connection error"));
connectDB.once("open", () => {
  console.log("Database is Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: "https://res.cloudinary.com/dwqnji86y/image/upload/v1752161452/YelpCamp/gzhedmpb7oh0cc8rdo1u.jpg",
          fileName: "YelpCamp/gzhedmpb7oh0cc8rdo1u",
        },
        {
          url: "https://res.cloudinary.com/dwqnji86y/image/upload/v1752161454/YelpCamp/nqxarxdnd8vmblzgl5tv.jpg",
          fileName: "YelpCamp/nqxarxdnd8vmblzgl5tv",
        },
        {
          url: "https://res.cloudinary.com/dwqnji86y/image/upload/v1752161459/YelpCamp/koomeusouvxqzv2csj7l.jpg",
          fileName: "YelpCamp/koomeusouvxqzv2csj7l",
        },
      ],
      author: `686d53c1588fdade27707c5c`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic earum aperiam non,laudantium, impedit ea eveniet aspernatur voluptates itaque ut ex minima officiis sapiente assumenda repudiandae, maxime dolor. Rerum, qui?",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
