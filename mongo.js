'use strict'
require('dotenv').config() //Set environment variables from private file

const password = process.env.WEB_DEV_MONGODB_PASSWORD;

if (!password) throw new Error("Could not find password");

const uri = `mongodb://ja-manrique:${password}@duozi-web-shard-00-00-072t6.mongodb.net:27017,duozi-web-shard-00-01-072t6.mongodb.net:27017,duozi-web-shard-00-02-072t6.mongodb.net:27017/test?ssl=true&replicaSet=Duozi-web-shard-0&authSource=admin&retryWrites=true`;
MongoClient.connect(uri, function(err, client) {
  module.exports = client
});

