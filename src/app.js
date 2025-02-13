const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const {validatorFunction} = require("./utils/validator.js")
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

//Signup API
app.post("/signup", async (req, res) => {
  //Creating an instance of user model
  
  try {
    const data = req.body;
    // console.log(data);
    
    validatorFunction(req);
    
    const {firstName, lastName, password, email, phoneNumber } = req.body;
    
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
app.get("/login", async (req, res) => {
  try{

    const {email, password} = req.body;

    const user = await User.findOne({email: email});

    if(!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    
    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  } 
});

//User API
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    // console.log(userEmail); //email sent using postman
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("Error: " + err.message);
    } else {
      return res.send(user);
    }
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).send("Error: " + err.message);
  }
});

//Delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId; //fetch userId from request body

  try {
    const users = await User.findByIdAndDelete(userId);
    // const users = await User.findByIdAndDelete({_id: userId});
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

//Update user
app.patch("/user/:userId", async (req, res) => {
  
  try {
    const userId = req.params?.userId;//getting userId from params
    const data = req.body;
  
    // console.log(userId, data);

    const allowedUpdates = ["age", "firstName", "lastName", , "phoneNUmber", "skills", "password", "photoUrl"];//other fields than these will be ignored

    const isAllowedUpdates = Object.keys(data).every((key) => allowedUpdates.includes(key));//loops through each field and checks is it allowed

    if(!isAllowedUpdates){
      throw new Error("Updates not allowed");
    }

    if(data?.skills.length > 5){
      throw new Error("Max 5 skills allowed");
    }

    // const users = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "before"});
    const users = await User.findOneAndUpdate({ _id: userId }, data, {runValidators: true}); //using email
    console.log(users);
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

//Feed api
app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database");
  });
