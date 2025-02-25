const express = require("express");
const User = require("../models/user.js");
const { userAuth } = require("../middleware/userAuth.js");
const { validateEditRequest } = require("../utils/validator.js");

const profileRouter = express.Router();

//Profile Api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not exist");
    }

    res.send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

//Update profile API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = await validateEditRequest(req);
    if (!isValid) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

//password change  API

module.exports = profileRouter;
