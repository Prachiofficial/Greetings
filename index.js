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
const types = require('./greetings.json');


//Cors
app.use(cors());

//Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true  }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

//Models 
const User = require('./models/user');
const user = require('./models/user');

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Public folder
app.use(express.static('public'));

//Routes

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }

app.get('/', (req, res) => {
  res.render('user')
});

app.post('/v1/verify', authenticateToken, (req, res) => {
    let text = req.body.message;
    if(!req.body.message){
        res.status(400).json({
            message: 'Please provide a message'
        })
    }else {
        let greeting = false;
        let greetingType = '';
        types.greetings.forEach(type => {
            if(text.includes(type)){
                greeting = true;
                greetingType = type;
            }
        });
        if(greeting){
            res.status(200).json({
                message: 'The message is a greeting',
                type: greetingType,
                greeting: true
            })
        }
        else {
            res.status(400).json({
                message: 'The message is not a greeting',
                type: 'none',
                greeting: false
            })
        }
    }
});

function generateAccessToken(username, password) {
    return jwt.sign({username: username, password: password }, process.env.JWT_SECRET, { expiresIn: '365d' });
  }


app.post(`/admin/createUser`, (req, res)=> {
    if(req.query.key != process.env.ADMIN_KEY){
        res.status(401).json({
            message: 'You are not authorized to do this!'
        })
    }else{
    const token = generateAccessToken({ username: req.body.username, password: req.body.password });
    let findUser = User.findOne({username: req.body.username}, (err, user) => {
        if(err){
            console.log(err);
        }else{
            if(user){
                res.status(400).json({
                    message: 'User already exists!'
                })
            }else{
                let newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                    apiKey: token
                });
                newUser.save(() => {
                    res.status(200).json({token: token, state: 'success'});
                })
            }
        }
    })
    }
})


//Starting the server

app.listen(port, () => {
  console.log('\x1b[33mServer is running on port: \x1b[0m' + port);
});