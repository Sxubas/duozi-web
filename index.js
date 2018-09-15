'use strict';
require('dotenv').config(); //Set environment variables from private file
const Users = require('./services/Users');
const Collections = require('./services/Collections');
const Tools = require('./services/Tools');
const MongoClient = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//
//Main entry point. Responsible of setting express app, mongoDB connections 
//and serving frontend app. Exposes all services to the client (Users, Collections and Tools)
//

const app = express();

app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(bodyParser.raw({
  type: 'multipart/form-data',
  limit: '20mb'
}));
app.use(cors());

const mongoSetup = (callback) => {
  const password = process.env.WEB_DEV_MONGODB_PASSWORD;

  if (!password) throw new Error('Could not find password');

  const uri = `mongodb://ja-manrique:${password}@duozi-web-shard-00-00-072t6.mongodb.net:27017,duozi-web-shard-00-01-072t6.mongodb.net:27017,duozi-web-shard-00-02-072t6.mongodb.net:27017/test?ssl=true&replicaSet=Duozi-web-shard-0&authSource=admin&retryWrites=true`;

  //Connect to mongo cloud
  MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
    if (err) throw err;
    else console.log('Successfully connected to mongoDB');
    //Afterwards instruction, client stands for a mongoClient connected to mongoAtlas instance
    callback(client);
  });
};

//Setting up endpoints
const expressSetup = (mongoClient) => {

  const db = mongoClient.db('duozi');

  //CRUD Users
  app.get('/users', (req, res) => {
    Users.login(req, res, db);
  });

  app.post('/users', (req, res) => {
    Users.signup(req, res, db);
  });

  app.put('/users', (req, res) => {
    Users.update(req, res, db);
  });

  app.delete('/users', (req, res) => {
    Users.delete(req, res, db);
  });

  //CRUD Collections
  app.get('/collections', (req, res) => {
    Collections.getAllwords(req, res, db);
  });

  app.post('/collections', (req, res) => {
    Collections.addWord(req, res, db);
  });

  app.put('/collections', (req, res) => {
    Collections.modifyWord(req, res, db);
  });

  app.delete('/collections', (req, res) => {
    Collections.deleteWord(req, res, db);
  });

  //Tools API
  app.post('/tools/recognize', Tools.recognizeCharacters);  
  app.get('/tools/hanziToPinyin', Tools.hanziToPinyin);
  app.get('/tools/pinyinToHanzi', Tools.pinyinToHanzi);
  app.get('/tools/librarySearch', Tools.dictionarySearch);

  //Serving react resources
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  //For any request that does not match any other endpoint, return app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
  });

  startServer();
};

//Begin listening to requests
const startServer = () => {
  app.listen(8080, () => {
    console.log('Server successfully run');
  });
};

mongoSetup(expressSetup);
