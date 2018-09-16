const ObjectID = require('mongodb').ObjectID;
//
// Set of functions responsible of managing word collections logic for each user
// In charge of CRUD operations and custom queries over mongoDB
//

const Collections = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Collections.getAllwords = (req, res, db) => {
  db.collection('collections').findOne({'email': req.header('email')}, (err, r) => {
    if(err) res.send(err);
    else if(!r) res.send([]);
    else res.send(r.characters);
  });
};

Collections.addWord = (req, res, db) => {
  db.collection('collections').findOne({'email': req.body.email}, (err, r) => {
    if(err) res.send(err);
    else if(r) {
      db.collection('collections').findOneAndUpdate({'email': req.body.email}, {$push: {characters: {
        '_id': new ObjectID(),
        'dateCreated': Date.now(),
        'simplified': req.body.simplified,
        'traditional': req.body.traditional,
        'pinyins': req.body.pinyins
      }}}, {returnOriginal: false}, (err, r) => {
        if(err) {
          res.status(500).send(err);
        }
        else res.send(r.value);
      });
    }
    else {
      db.collection('collections').insertOne({'email': req.body.email, characters: [{
        'id': new ObjectID(),
        'dateCreated': Date.now(),
        'simplified': req.body.simplified,
        'traditional': req.body.traditional,
        'pinyins': req.body.pinyins
      }], 'categories': []}, (err, r) => {
        if(err) res.send(err);
        else res.send(r.ops[0]);
      });
    }
  });
};

Collections.modifyWord = (req, res, db) => {
  db.collection('collections').findOne({'email': req.body.email, 'characters.id': req.body.id}, (err, r) => {
    if(err) res.status(500).send(err);
    else if(!r) {
      res.status(404);
      res.send('User or character not found.');
    }
    else {
      db.collection('collections').findOneAndUpdate({'email': req.body.email, 'characters.id': req.body.id}, {$set: {'characters.$.simplified': req.body.simplified===undefined?r.characters.find(x => x.id === req.body.id).simplified:req.body.simplified, 'characters.$.traditional': req.body.traditional===undefined?r.characters.find(x => x.id === req.body.id).traditional:req.body.traditional, 'characters.$.pinyins': req.body.pinyins===undefined?r.characters.find(x => x.id === req.body.id).pinyins:req.body.pinyins}}, {returnOriginal: false}, (err2, r2) => {
        if(err2) res.status(500).send(err2);
        else res.send(r2.value);
      });
    }
  });
};

Collections.deleteWord = (req, res, db) => {
  db.collection('collections').findOneAndUpdate({'email': req.body.email}, {$pull: {characters: {'id': req.body.id}}}, {returnOriginal: false}, (err, r) => {
    if(err) {
      res.status(500);
      res.send(err);
    }
    else if(!r.value) {
      res.status(404);
      res.send('User not found.');
    }
    else res.send('Word removed successfully.');
  });
};
module.exports = Collections;
