'use strict';
//
// Set of functions responsible of managing users
// In charge of CRUD operations relating users
//

const Users = {};

Users.login = (req, db, cbk) => {
  db.collection('users').findOne({"email": req.body.email}, (err, res) => {
    if(err) cbk(false);
    else cbk(res.password == req.body.password);
  });
};

Users.signup = (req, db, cbk) => {
  if(!req.body.email || !req.body.password) {
    cbk(null);
  }
  else {
    db.collection('users').find({"email": req.body.email}, (err, res) => {
      if(!err) {
        cbk(null);
      }
      else {
        db.collection('users').insertOne({
          email: req.body.email,
          password: req.body.password
        }, (err, r) => {
          if(err) {
            cbk(null);
          }
          cbk(r.ops[0]);
        });
      }
    });
  }
};

Users.update = (req, db, cbk) => {
  if(!req.body.email || !req.body.password) {
    cbk(null);
  }
  db.collection('users').findOneAndUpdate({"email": req.body.email}, {$set: {"password": req.body.password}}, (err, res) => {
    if(err) cbk(null);
    else cbk(res.value);
  })
};

Users.delete = (req, db, cbk) => {
  if(!req.body.email) cbk(false);
  db.collection('users').findOneAndDelete({"email": req.body.email}, (err, res) => {
    if(err) cbk(false);
    else cbk(true);
  })
};

//Export as a file, in order to call it like: Users.[function]
module.exports = Users;
