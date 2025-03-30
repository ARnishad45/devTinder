const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = ('/user', async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token){
           return res.status(401).send("Please Login");
        }
        
        const decodeToken = await jwt.verify(token, "#Dev@Tinder$AR45");
        
        const {_id} = decodeToken;
        
        const user = await User.findById(_id);
        // console.log(user);

        if(!user){
            throw new Error("Invalid credentials");
        }

        req.user = user; //attaching user to request object
        next();
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }

});

module.exports = {userAuth}