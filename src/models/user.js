const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type : 'string',
        required : true,
        minLength : 3,
        maxLength : 50
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
        validate (value) {
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Invalid geneder!")
            }
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

const User = mongoose.model("User", userSchema);

module.exports = User;