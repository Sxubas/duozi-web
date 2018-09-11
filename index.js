'use strict';
require('dotenv').config(); //Set environment variables from private file
const Users = require('./services/Users');
const Collections = require('./services/Collections');
const Tools = require('./services/Tools');
const MongoClient = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const cors = require('cors');

//
//Main entry point. Responsible of setting express app, mongoDB connections 
//and serving frontend app. Exposes all services to the client (Users, Collections and Tools)
//

const app = express();
let db;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8')
  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });
}); 

const mongoSetup = (callback) => {
  const password = process.env.WEB_DEV_MONGODB_PASSWORD;

  if (!password) throw new Error("Could not find password")

  const uri = `mongodb://ja-manrique:${password}@duozi-web-shard-00-00-072t6.mongodb.net:27017,duozi-web-shard-00-01-072t6.mongodb.net:27017,duozi-web-shard-00-02-072t6.mongodb.net:27017/test?ssl=true&replicaSet=Duozi-web-shard-0&authSource=admin&retryWrites=true`;
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;
    else console.log('Successfully connected to mongoDB');
    //Afterwards instruction, client stands for a mongoClient connected to mongoAtlas instance
    callback(client);
  });
}

//Setting up endpoints
const expressSetup = () => {

  app.use(cors());

  app.get('/', (req, res) => {
    res.json({ 'message': 'Server running!' });
  });

  app.post('/', upload.single('file'), Tools.recognizeCharacters);
}

//Begin listening to requests
const startServer = (mongoClient) => {
  db = mongoClient.db('duozi');
  app.post('/users', (req, res) => {
    const cbk = function(obj) {
      if(obj) res.send(obj);
      else {
        res.status(500)
        res.send('error')
      }
    }
    console.log(req.body);
    Users.signup(req, db, cbk);
  })
  app.listen(8080, () => {
    console.log("Server successfully run");
  });
}

expressSetup();
mongoSetup(startServer);
