const validator = require("validator");

const validatorFunction = (req) => {
    const {firstName, lastName, password, email, phoneNumber} = req.body;

    // console.log("Validator running: " + firstName, lastName, password, email, phoneNumber);

    if(!firstName || !lastName){
        throw new Error("Both first and last name are mandatory.");
    }

    else if(!password){
        if(!validator.isStrongPassword(password)){
            throw new Error("Please use strong password");
        }
    }

    else if(!email){
        if(!validator.isEmail(email)){
            throw new Error("Invalid email address");
        }
    }

    else if(!phoneNumber){
        if(!validator.isNumeric(phoneNumber)){
            throw new Error("Invalid phone number");
        }
    }
}

module.exports = {validatorFunction};