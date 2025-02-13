const adminAuth = (req, res, next) => {
    console.log("Admin auth called");
    const token = "admin";
    const isAuthenticated = token === "admin";
    if(!isAuthenticated) {
        res.status(401).send("Not an admin");
    }
    else{
        next();
    } 
};

module.exports = {adminAuth}