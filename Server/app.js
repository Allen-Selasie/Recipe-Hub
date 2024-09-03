//packages
const mongoose =  require('mongoose');
const MongoStore = require('connect-mongo');
const express = require('express');
const app = express();
const session = require("express-session")
const path = require("path");
const compression = require('compression');


//Routes
const UserRoutes = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');




//Middleware
const requireLogin = require('./Middleware/authMiddleware');



//Models
const Category = require('./models/category');
const Recipe = require('./models/recipe');
const Card = require('./models/cards');


//Environment variables
require('dotenv').config();
const mongouri = process.env.mongouri;
const port = process.env.PORT || 3000;

//connect to database
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

//enable compression
app.use(compression());

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

 
//Main Routes
app.get("/",async (req,res)=>{
  const recipes = await Recipe.getFeed();
  res.render("index",{recipes});
})

app.get("/home",requireLogin, async(req,res)=>{
  const user = req.session.user;
  try {
    const recipes = await Recipe.getFeed(user._id);
   
  const categories = await Category.find();
  res.render("home",{user, categories, recipes});

  } catch (error) {
    console.log(error);
    res.redirect("/u/login");
  }
})


//External Routes
app.use("/u",UserRoutes);
app.use('/recipe',requireLogin,recipeRouter);


//404 Route
app.use((req, res) => {
  res.send("404: Page not found");
});


app.listen(port,()=>{
    console.log(`app is listenind on port ${port}!!`);
})