const express = require('express');
const app = express();
const session = require("express-session")
const path = require("path")

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
      secret: "Recipe_stuff",
      resave: false,
      saveUninitialized: true,
    })
  );
  
app.get("/",(req,res)=>{
  const recipies =  require("./stuff.json");
    res.render("index",{recipies});
})

app.get("/login",(req,res)=>{
  const name = "Philip"
  res.render("sidebar",{name})
})

app.get("/",(req,res)=>{
  
})

app.listen("2000",()=>{
    console.log("app is listenind on port 2000!!")
})