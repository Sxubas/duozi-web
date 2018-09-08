'use strict'
const Users = require('./services/Users');
const Collections = require('./services/Collections');
const Tools = require('./services/Tools');
const MongoClient = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config() //Set environment variables from private file

//
//Main entry point. Responsible of setting express app, mongoDB connections 
//and serving frontend app. Exposes all services to the client (Users, Collections and Tools)
//

const app = express();
app.use(bodyParser.json()); //For parsing application/json in request's body

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

  app.get('/', (req, res) => {
    res.json({ 'message': 'Server running!' });
  });

}

//Begin listening to requests
const startServer = (mongoClient) => {
  app.listen(8080, () => {
    console.log("Server successfully run");
  });
}

expressSetup();
mongoSetup(startServer);
