const express = require("express");
const User = require("../models/user");
const UserRoutes = express.Router();
const { verifyPassword } = require("../utilities/encryption");
const requireLogin = require("../Middleware/authMiddleware");

UserRoutes.post("/create", async (req, res) => {
  const { username, email, password, confirm } = req.body;
//   console.log(req.body);
  if (!username || !email || !password || !confirm) {
    res.send("All fields required!");
  }

  if (password !== confirm) {
    res.send("Incorrect password!");
  }
     // Find the user with the provided email
     const current_user = await User.findOne({ email: email });

     if (current_user) {
       // User  found
       return res.redirect("/home")
     }
  try {
    const Candidate = new User({
      username,
      email,
      password,
    });
    await Candidate.save();
    // Mark the session as authenticated
    req.session.authenticated = true;
    req.session.user = Candidate;
    return res.render("home", { username });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

UserRoutes.get("/login", (req, res) => {
  if (req.session.authenticated) {
    // Authentication successful, you can redirect or send a success message
    return res.redirect("/home");
  }
  return res.render("registration");
});

UserRoutes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
  });
  res.redirect("/");
});

UserRoutes.post("/login", async (req, res) => {
  try {
    // Get the submitted form data
    const { email, password } = req.body;

    // Find the user with the provided email
    const current_user = await User.findOne({ email: email });

    if (!current_user) {
      // User not found
      return res.status(401).json("User not found");
    }

    // Verify the password
    const hashedPassword = current_user.password;
    const isMatch = await verifyPassword(password, hashedPassword);

    // Check if the password matches
    if (!isMatch) {
      // Incorrect password
      return res.status(401).json("Incorrect password");
    }

    // Mark the session as authenticated
    req.session.authenticated = true;
    req.session.user = current_user;
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = UserRoutes;
