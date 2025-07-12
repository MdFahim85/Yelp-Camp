if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");

const campRoutes = require("./routes/campRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const expressError = require("./utils/expressError");
const User = require("./models/user.model");

const MongoDBStore = require("connect-mongo");

const DB = process.env.DB_URI;

const mongoose = require("mongoose");
mongoose.connect(DB);

const connectDB = mongoose.connection;
connectDB.on("error", console.error.bind(console, "connection error"));
connectDB.once("open", () => {
  console.log("Database is Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoDBStore.create({
  mongoUrl: DB,
  secret: "42069secretStuff",
  touchAfter: 24 * 3600,
});

const sessionConfig = {
  store,
  secret: "42069secretStuff",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

port = 3000;

app.get("/home", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.use((req, res, next) => {
  next(new expressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
});
