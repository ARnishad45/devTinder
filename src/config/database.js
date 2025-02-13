const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://arunnishad45:arun7075@cluster0.bjfwzar.mongodb.net/DevTinder");
};

module.exports = connectDB;