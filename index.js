//Setup the project
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');


//Cors
app.use(cors());

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Public folder
app.use(express.static('public'));

//Routes

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Greetings API 🎉',
    endpoint: 'Please use the /v1/verify endpoint to do the stuff',
    note: 'Please use your own API key to test the API get one from https://greetings-api.encodin.me/'
  })
});

//Admin Routes

function generateAccessToken(username, password) {
    return jwt.sign({username: username, password: password }, process.env.JWT_SECRET, { expiresIn: '365d' });
  }


app.post(`/admin/createUser`, (req, res)=> {
    if(req.query.key != process.env.ADMIN_KEY){
        res.status(401).json({
            message: 'You are not authorized to do this'
        })
    }else{
    const token = generateAccessToken({ username: req.body.username, password: req.body.password });
    res.json({token: token, state: 'success'});
    }
})


//Starting the server

app.listen(port, () => {
  console.log('\x1b[33mServer is running on port: \x1b[0m' + port);
});