const express = require('express');
const app = express();
const session = require("express-session")
const path = require("path");
const UserRoutes = require('./routes/userRoutes');
const mongoose =  require('mongoose');
const Card = require('./models/cards');
const requireLogin = require('./Middleware/authMiddleware');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const Category = require('./models/category');

const mongouri = process.env.mongouri;
const port = process.env.PORT || 3000;


mongoose.connect(mongouri,{
  maxPoolSize:100,
  dbName:"recipe_hub"
})
// Configure Express to handle JSON data
app.use(express.json());

// Configure Express to handle URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set the views directory
app.set("views", path.join(__dirname, "../Client"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../Client/public")));

// //enable compression
// app.use(compression());

//session management
app.use(
  session({
    secret: "recipe-hub",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongouri,
      dbName:"recipe_hub"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 1, // 1 hour
    },
  })
);

  
app.get("/",async (req,res)=>{
  const recipies = await Card.find();
  res.render("index",{recipies});
})

app.get("/home",requireLogin, async(req,res)=>{
  const user = req.session.user;
  try {
   
  const categories = await Category.find();
  res.render("home",{user, categories});

  } catch (error) {
    console.log(error);
    res.redirect("/u/login");
  }
})



app.use("/u",UserRoutes)

app.listen(port,()=>{
    console.log(`app is listenind on port ${port}!!`);
})