const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./valuekeys')
mongoose.connect(MONGOURI);
mongoose.connection.on("connected",()=>{
    console.log("we are connted to server");
})

mongoose.connection.on("error",()=>{
    console.log("we are  not connted to server");
})
app.get("/", (req,res)=>{
    res.send("hello");
})
app.listen(3000,()=>{
    console.log("server is running succrssfully");
})
require('./models/questions');
app.use(express.json());
app.use(require('./routes/authen'));