const express = require("express");
const User = require("../models/user");
const UserRoutes = express.Router();
const { verifyPassword, hashPassword } = require("../utilities/encryption");
const requireLogin = require("../Middleware/authMiddleware");
const sendMail = require('../utilities/mail');
const Category = require("../models/category");
const multer = require("multer");
const Recipe = require("../models/recipe");
const uploadImage = require("../Controllers/ImageUpload");

const upload = multer({storage: multer.memoryStorage()});


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
    // Increment loginCount
    current_user.loginCount += 1;
    await current_user.save();
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


UserRoutes.post("/update",  upload.single('file'),requireLogin, async (req, res) => {
    const { name, username, email, old_pass, new_pass, c_pass,bio,contact,location } = req.body;
    
  //console.log(await req.body);
    try {
      const current_user = req.session.user;
      const updates = {};
  
 
      // Handle password change if old_pass and new_pass are provided
      if (old_pass && new_pass) {
        const isMatch = await verifyPassword(old_pass, current_user.password);
        if (!isMatch) {
          return res.status(400).send({ message: "Old password is incorrect" });
        }
        if (new_pass !== c_pass) {
          return res.status(400).send({ message: "Passwords do not match" });
        }
        const newpass = await hashPassword(new_pass);
        updates.password = newpass;
      }
  
      // Update only the provided fields (name, username, email)
      if (name) updates.name = name;
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (bio) updates.bio = bio;
      if(req.file) updates.image = await uploadImage(req.file);
      if (contact) updates.contact = contact;
      if (location) updates.location = location;
  
      // Update the user document in the database if there are updates
      if (Object.keys(updates).length > 0) {
        await User.updateOne({ _id: current_user._id }, { $set: updates });
      }
  
      // Fetch the updated user document
      const updatedUser = await User.findOne({ _id: current_user._id });
      //console.log(updates);
      
      // Update the session user with the updated details
      req.session.user = updatedUser;
   // Update successful response
   res.status(200).json({ message: "Update successful!", success: true });
  //switch to not new login
  updatedUser.newLogin = false;
  updatedUser.save();

    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
});

UserRoutes.get("/forgotPassword", (req, res) => {
    try {
        // Render the email input form
        res.send(`
            <h1>Forgot Your Password?</h1>
            <form action="/u/forgotPassword" method="POST">
                <input type="email" name="email" placeholder="Enter your email address" required />
                <button type="submit">Send Reset Link</button>
            </form>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("<h1>Internal Server Error</h1>");
    }
});

UserRoutes.post("/forgotPassword", async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user with the provided email
        const user = await User.findOne({ email });

        if (!user) {
            // User not found
            return res.status(404).json({ message: "User not found" });
        }

        // Use the user's ID as the token
        const token = user._id.toString();

        // Set the token expiration (optional)
        user.resetPasswordExpires = Date.now() + 360000; // Token expires in 10minutes
        await user.save();

        // Compose the reset password email
        const resetPasswordLink = `${req.protocol}://${req.get("host")}/u/reset/${token}`;
        const message = {
            html: `<p>Click the following link to reset your password:</p><a href="${resetPasswordLink}">${resetPasswordLink}</a>
            
            <br><p>This linkexpires in 10 minutes</p>`,
            subject: `Recipe Hub Password Reset`,
        };

        // Send the reset password email
        await sendMail(email, message);

        // Return success response
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


UserRoutes.post("/reset/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find the user with the provided token (user ID)
        const user = await User.findById(token);

        if (!user) {
            return res.status(400).json({ message: "Invalid token or token has expired" });
        }

        // Check if the token has expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        // Update the user's password
        user.password = password; // Ideally, hash the password before saving
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration date
        await user.save();

        // Return success response
        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

UserRoutes.get("/reset/:token", async (req, res) => {
    try {
        const { token } = req.params;

        // Find the user with the provided token (user ID)
        const user = await User.findById(token);

        if (!user) {
            return res.status(400).send("<h1>Invalid token</h1>");
        }

        // Check if the token has expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).send("<h1>Token has expired</h1>");
        }

        // Render the password reset form if the token is valid and not expired
        res.send(`
            <h1>Reset Your Password</h1>
            <form action="/u/reset/${token}" method="POST">
                <input type="password" name="password" placeholder="Enter your new password" required />
                <button type="submit">Reset Password</button>
            </form>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("<h1>Internal Server Error</h1>");
    }
});


UserRoutes.get("/my-recipes", requireLogin, async (req, res) => {
    const user = req.session.user;
    const categories = await Category.find();
    res.render("recipe", { user, categories });
});


UserRoutes.post('/add-recipe', upload.array('file',10), requireLogin, async (req, res) => {
    const { title,description, ingredients, instructions,category,time,difficulty } = req.body;  
    const user = req.session.user;
  console.log('uploading');

    if (!req.files) {
      console.log('no file');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        //console.log(req.files)
        const imageUrl = await uploadImage(req.files);
        //console.log(imageUrl);
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            category,
            time,
            difficulty,
            media: imageUrl,
            author:user._id,
        });
        console.log(newRecipe);

        await newRecipe.save();
        res.status(201).json({ message: 'Recipe added successfully', sucess: true });
    }catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  
  
  
  });


module.exports = UserRoutes;
