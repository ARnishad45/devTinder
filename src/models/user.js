const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : 'string',
        required : true,
        minLength : 3,
        maxLength : 50,
        index: true, //makes querry faster
    },
    lastName : {
        type : 'string',
    },
    email: {
        type : 'string',
        required : true,
        unique : true,
        trim: true,
        lowercase : true,
        validate (value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password : {
        type : 'string',
        required : true,
    },
    phoneNumber : {
        type : 'number',
        required : true,
        unique: true,
    },
    age : {
        type : 'number',
        min: 18
    },
    photoUrl : {
        type : 'string',
        default : 'http://dummy.profile.com/photo.jpeg',
        validate (value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url: ")
            }
        }
    },
    gender : {
        type : 'string',
        // required : true,
        // validate (value) {
        //     if(!["male", "female", "other"].includes(value)){
        //         throw new Error("Invalid geneder!")
        //     }
        // }
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is incorrect gender`
        }
    },
    skills : {
        type: [String],
    },
},
{
    timestamps: true,
}
);

userSchema.index({firstName: 1, lastName: 1});
userSchema.index({gender: 1});

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "#Dev@Tinder$AR45", {expiresIn: '7d'});

    // console.log(token);

    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;

    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);

    return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;