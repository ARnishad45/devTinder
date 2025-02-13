const userAuth = ('/user', (req, res, next) => {
    console.log("Authentication middleware called")
    const token = "xyz";
    const isAuthenticated = token === "xyz";
    if(token != "xyz") {
        req.status(401).send("Invalid request token");
    }
    else{
        next();
    }
});

module.exports = {userAuth}