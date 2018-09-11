//
// Set of functions responsible of managing word collections logic for each user
// In charge of CRUD operations and custom queries over mongoDB
//

const Collections = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Collections.getAllwords = (req, db, cbk) => {
  db.Collections.findOne({"email": req.body.email}, (err, res) => {
    if(err) cbk([]);
    else cbk(result.characters);
  })
};

Collections.addWord = (req, db, cbk) => {
  db.Collections.findOneAndUpdate({"email": req.body.email}, {$push: {characters: {$each: [{"id": req.character.id, "dateCreated": Date.now()}]}}}, (err, res) => {
    if(err) cbk(null);
    else cbk(res.value);
  });
};

Collections.modifyWord = () => {
  

  });
};

Collections.deleteWord = (req, db, cbk) => {
  db.Collections.findOneAndUpdate({"email": req.body.email}, {$pull: {characters: {$each: [{"id": req.character.id}]}}}, (err, res) => {
    if(err) cbk(false);
    else cbk(true);
  });
};

//Retrieves words whose character or pinyin matches to the search string
Collections.search = () => {

};

//Retirieves words whose categories include at least one of the parameter categories
Collections.filterByCategory = () => {

};

module.exports = Collections;
