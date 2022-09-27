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


//Starting the server

app.listen(port, () => {
  console.log('\x1b[33mServer is running on port: \x1b[0m' + port);
});