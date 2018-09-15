//
// Set of functions responsible of managing word collections logic for each user
// In charge of CRUD operations and custom queries over mongoDB
//

const Collections = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Collections.getAllwords = (req, res, db) => {
  db.collection('collections').findOne({"email": req.header('email')}, (err, r) => {
    if(err) res.send(err);
    else if(!r) res.send([]);
    else res.send(r.characters);
  });
};

Collections.addWord = (req, res, db) => {
  db.collection('collections').findOne({"email": req.body.email}, (err, r) => {
    if(err) res.send(err)
    else if(r) {
      db.collection('collections').findOneAndUpdate({"email": req.body.email}, {$push: {characters: {
        "id": req.body.id,
        "dateCreated": Date.now(),
        "simplified": req.body.simplified,
        "traditional": req.body.traditional,
        "pinyins": req.body.pinyins
      }}}, (err, r) => {
        if(err || !r.value) {
          res.send('yaper');
        }
        else res.send(r.value);
      });
    }
    else {
      db.collection('collections').insertOne({"email": req.body.email, characters: [{
        "id": req.body.id,
        "dateCreated": Date.now(),
        "simplified": req.body.simplified,
        "traditional": req.body.traditional,
        "pinyins": req.body.pinyins
      }], "categories": []}, (err, r) => {
        if(err) res.send(err);
        else res.send('wiiiii');
      });
    }
  });
  
};

Collections.modifyWord = (req, res, db) => {
  db.collection('collections').findOne({"email": req.body.email, "characters": {"id": req.body.id}}, (err, r) => {

  });
}

Collections.deleteWord = (req, res, db) => {
  db.collection('collections').findOneAndUpdate({"email": req.body.email}, {$pull: {characters: {"id": req.body.id}}}, (err, r) => {
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
