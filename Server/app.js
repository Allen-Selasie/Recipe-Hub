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
const User = require('./models/user');


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
  const recipes = await Recipe.getFeatured();
  res.render("index",{recipes});
})

app.get("/home",requireLogin, async(req,res)=>{
  let user = req.session.user;
  try {
    const recipes = await Recipe.getFeed(user._id);
    const feed = await Recipe.getFeed();

    user = await User.findById(user._id);
    const saved_recipes = user.saves;
  const savedRecipesDetails = await Recipe.find({_id:{$in:saved_recipes}}).populate('author', 'username');
    const savedRecipes = savedRecipesDetails.map(recipe => {
      return {
        _id: recipe._id,
        title: recipe.title,
         description: recipe.description,
          author: recipe.author.username,
      };
    });

   const categories = await Category.find();

    res.render("home", { user, categories,recipes, savedRecipes });


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