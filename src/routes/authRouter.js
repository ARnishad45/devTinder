const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validatorFunction } = require("../utils/validator.js");

const authRouter = express.Router();

//Signup API
authRouter.post("/signup", async (req, res) => {
  //Creating an instance of user model

  try {
    const requestData = req.body;
    // console.log( "req data : ", data);

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

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    // console.log(savedUser);
    res.json({ message: "User added successfully", data: savedUser });
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

      res.json({
        message: "Login successfull",
        data: user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Logout
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(Date.now()) });
    res.send("Succesfully logged out!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
