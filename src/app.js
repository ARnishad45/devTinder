const express = require('express');

const app = express();

app.use("/test",(req, res) => {
    res.send("Hello from the server");
});

app.use("/hello",(req, res) => {
    res.send("Hello, Ki hal chal paaji!!");
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
}); 