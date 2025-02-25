const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validatorFunction } = require("../utils/validator.js");

const authRouter = express.Router();

//Signup API
authRouter.post("/signup", async (req, res) => {
    //Creating an instance of user model
  
    try {
      const data = req.body;
      // console.log(data);
  
      validatorFunction(req);
  
      const { firstName, lastName, password, email, phoneNumber } = req.body;
  
      const passwordHash = await bcrypt.hash(password, 10);
      // console.log(passwordHash);
  
      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        phoneNumber,
      });
  
      await user.save();
      res.send("User added successfully");
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
  });
  
  //Login API
  authRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Invalid credentials");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
  
        res.send("Login successfull");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

  //Logout
  authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expiresIn: Date.now()});
    res.send("Succesfully logged out!")
  });

module.exports = authRouter;